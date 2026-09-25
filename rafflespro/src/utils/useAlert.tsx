import type { SweetAlertOptions } from 'sweetalert2';

import Swal from 'sweetalert2';

export const useAlert = () => {
  const sAlert = (sProps: SweetAlertOptions, funct?: (param?: any) => void): void => {
    sProps.topLayer = true;
    sProps.title = sProps.title || '';
    sProps.html = sProps.html || '';
    sProps.icon = sProps.icon || 'info';
    sProps.confirmButtonText = sProps.confirmButtonText || 'Ok';
    sProps.confirmButtonColor = sProps.confirmButtonColor || '#ff5630';
    
    Swal.fire(sProps)
    .then(()=>{
      if (funct) {
        funct();
      }
    });
  }

  const sConfirm = (sProps: SweetAlertOptions, funct?: (param?: any) => void): void => {
    sProps.topLayer = true;
    sProps.title = sProps.title || '';
    sProps.allowOutsideClick = false;
    sProps.confirmButtonColor = sProps.confirmButtonColor || '#1877F2';
    sProps.showDenyButton = sProps.showDenyButton || true;
    sProps.denyButtonText = sProps.denyButtonText || 'Cancelar';
    sProps.denyButtonColor = sProps.denyButtonColor || '#ff5630';
    
    Swal.fire(sProps)
    .then((action)=>{
      if (funct){
        if (action.isConfirmed){ funct(); }
      }
    });
  }

  const sInput = async(sProps: SweetAlertOptions, inputValidatorText: string,  funct?: (param?: any) => void): Promise<string> => {
    const validateField = (value: any): string | void => !value ? inputValidatorText : undefined;

    sProps.topLayer = true;
    sProps.allowOutsideClick = false;
    sProps.confirmButtonColor = sProps.confirmButtonColor || '#1877F2';
    sProps.showDenyButton = sProps.showDenyButton || true;
    sProps.denyButtonText = sProps.denyButtonText || 'Cancelar';
    sProps.denyButtonColor = sProps.denyButtonColor || '#ff5630';
    sProps.input = sProps.input || 'text';
    sProps.inputLabel = sProps.inputLabel || '';
    sProps.inputValue = sProps.inputValue || '';
    sProps.inputValidator = validateField;

    const result = await Swal.fire(sProps);
    
    if (result.isConfirmed) {
      if (funct) {
        funct(result.value);
      }
      return result.value as string;
    }
    
    return '';
  } 

  return {
    sAlert,
    sConfirm,
    sInput,
  }
}