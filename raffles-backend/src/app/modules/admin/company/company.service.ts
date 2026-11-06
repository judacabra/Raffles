import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyPaymentDto } from './dto/create-company-payment.dto';

import { CompanyPayments } from './entities/company-payment.entity';
import { nextMounth } from '@/app/shared/utils/dates';
import { UserCompany } from '../user/entities/user-company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(CompanyPayments)
    private readonly companyPaymentsRepository: Repository<CompanyPayments>,

    @InjectRepository(UserCompany)
    private readonly userCompanyRepository: Repository<UserCompany>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const companyExist: boolean = await this.companyExistsByTaxId(createCompanyDto.taxId);

    if (companyExist) throw new NotFoundException(`Ya existe una empresa con el TaxId #${createCompanyDto.taxId}.`);

    createCompanyDto.dateAt = new Date().toISOString().split("T")[0];
    createCompanyDto.hourAt = new Date().toISOString().split("T")[1].split(".")[0];

    const company = this.companyRepository.create(createCompanyDto);

    return this.companyRepository.save(company);
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const normalized: UpdateCompanyDto = {
      ...updateCompanyDto,
      isActive: updateCompanyDto.isActive === true || (typeof(updateCompanyDto.isActive) === 'string' && updateCompanyDto.isActive === 'true'),
      isVisible: updateCompanyDto.isVisible === true || (typeof(updateCompanyDto.isVisible) === 'string' && updateCompanyDto.isVisible === 'true'),
    };

    await this.companyRepository.update(id, normalized);
    return this.findOne(id);
  }

  async findAll(): Promise<Company[]> {
    const companies = this.companyRepository
      .createQueryBuilder('c')
      .select('c.id', 'id')
      .addSelect('c.name', 'name')
      .addSelect('c.email', 'email')
      .addSelect('c.taxId', 'taxId')
      .addSelect('c.logoURL', 'logoURL')
      .addSelect('c.website', 'website')
      .addSelect('c.isActive', 'isActive')
      .addSelect("c.location", "location")
      .addSelect("c.tag", "tag")
      .addSelect('c.expiratedDate', 'expiratedDate')
      .addSelect('cp.dateAt', 'lastPayment')
      .leftJoin('company_payments', 'cp', 'c.id = cp.companyId AND c.lastPaymentId = cp.id')
      .where('c.isVisible = true')
      .orderBy('c.id', 'DESC')
      .getRawMany();

    return companies;
  }

  async findByParam(param: string | number): Promise<Company> {
    const company = await this.companyRepository
      .createQueryBuilder("c")
      .select("c.id", "id")
      .addSelect("c.name", "name")
      .addSelect("c.taxId", "taxId")
      .addSelect("c.website", "website")
      .addSelect("c.logoURL", "logoURL")
      .addSelect("c.location", "location")
      .addSelect("c.isActive", "isActive");

    if (typeof param === "number") company.where("c.id = :param", { param })
    if (typeof param === "string") company.where("LOWER(REPLACE(c.name, ' ', '')) = LOWER(REPLACE(:param, ' ', ''))", { param })
    
    const result = await company.getRawOne();

    if (!result) throw new NotFoundException(`Empresa ${(typeof param === "number") ? `de id #` + param : param } no encontrada.`);

    return result;
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) throw new NotFoundException(`Empresa #${id} no encontrada.`);

    return company;
  }

  async companyExistsByTaxId(taxId: string): Promise<boolean> {
    const company = await this.companyRepository.findOne({ where: { taxId } });
    return !!company;
  }

  async updateStatus(id: number, status: boolean): Promise<void> {
    await this.findOne(id);
    await this.companyRepository.update(id, { isActive: status });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.companyRepository.update(id, { isVisible: false });
  }

  // User company
  async findByUser(idUser: number): Promise<Company[]> {
    const userCompanies = await this.userCompanyRepository
      .createQueryBuilder('uc')
      .select([
        'c.id AS "id"',
        'c.logoURL AS "logoURL"',
        'c.name AS "name"',
        'c.taxId AS "taxId"',
      ])
      .leftJoin('user', 'u', 'u.id = uc.userId')
      .leftJoin('company', 'c', 'c.id = uc.companyId')
      .where('uc.isVisible = true')
      .andWhere('u.id = :idUser', { idUser })
      .orderBy('c.id', 'DESC')
      .getRawMany();

    return userCompanies;
  }

  // Payments
  async createPayment(createCompanyPaymentDto: CreateCompanyPaymentDto): Promise<CompanyPayments> {
    createCompanyPaymentDto.dateAt = new Date().toISOString().split("T")[0];
    createCompanyPaymentDto.hourAt = new Date().toISOString().split("T")[1].split(".")[0];

    const companyPayment = this.companyPaymentsRepository.create({
      ...createCompanyPaymentDto,
      company: { id: createCompanyPaymentDto.companyId },
    });

    const payment = await this.companyPaymentsRepository.save(companyPayment);

    const company = await this.findOne(createCompanyPaymentDto.companyId);

    await this.companyRepository.update(company.id, {
      lastPaymentId: payment.id,
      expiratedDate: nextMounth(),
    });

    return payment;
  }

  async getCompanyPayments(idCompany: number): Promise<CompanyPayments[]> {
    const companyPayments = await this.companyPaymentsRepository.find({ where: { company: { id: idCompany } } });
    return companyPayments;
  }
}