import { useEffect, useState } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addToast, Language } from "../../store/slices/uiSlice";
import { tr } from "../../i18n/translations";

import { appConfig } from "../../config";

import { PutUser } from "../../api/usersAPI";
import { updateUser } from "../../store/slices/authSlice";

const ProfilePage = () => {
  const dispatch = useAppDispatch();

  const lang: Language = useAppSelector((s: any) => s.ui.language);
  const userAuth: any = useAppSelector((s) => s.auth.user);

  const { uploadsFolder } = appConfig;

  const imageNotFound: string = "./images/not-found-image.png";

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [enterPage, setEnterPage] = useState<boolean>(false);

  const [user, setUser] = useState<any>(userAuth);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUser({ ...user, avatar: file, });

    const previewURL: string = URL.createObjectURL(file);

    setImagePreview(previewURL);
  };

  const saveUser = async (): Promise<void> => {
    if (!user) return;

    try {
      const dataSend = new FormData();

      dataSend.append('username', user.name);
      dataSend.append('email', user.email);

      if (user.avatar) dataSend.append('image', user.avatar);

      const data = await PutUser(user.id, dataSend);

      user.avatar = data.imageURL ?? 
        data.username
          .split(" ").map((w: any) => w[0])
          .join("").slice(0, 2).toUpperCase();

      dispatch(updateUser({ user }));
    } catch (err: any) {
      console.error(`Error al actualizar el usuario id #${user.id}: `, err);
    } finally {
      dispatch(addToast({ type: "success", message: tr("user_saved", lang) }));
    }
  };

  useEffect(() => {
    return () => {
      if (!enterPage) {
        setEnterPage(true);

        if (user.avatar.startsWith("uploads/")) {
          setImagePreview(uploadsFolder + "/" + user.avatar);
        }
      }
    };
  }, [enterPage, user]);

  useEffect(() => {
    if (!imagePreview) setImagePreview(imageNotFound);
  }, [imagePreview, imageNotFound]);


  return (
    <div
      style={{
        display: "flex", margin: "auto",
        flexDirection: "column", gap: 16, overflowY: "auto",
        padding: "10px 20px", width: "35%",
      }}
    >
      <div style={{ position: "relative", width: "100%", }}>
        <div
          style={{
            margin: "10px auto 0", border: "2px #c2c2c2 dashed",
            borderRadius: "50%", width: 200, height: 200, overflow: "hidden",
          }}
        >
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
            hidden
          />

          <label htmlFor="image">
            <img
              src={imagePreview ?? imageNotFound}
              alt={tr("previewImage", lang)}
              style={{
                width: "100%", height: "100%", objectFit: "cover", 
                cursor: "pointer", display: "block",
              }}
            />
          </label>

          <div
            style={{
              borderRadius: "50%", padding: "1% 1% 1.25%", color: "#b61e1e", position: "absolute", 
              border: "0.5px solid #b61e1e", width: 30, height: 30, background: "#fff", display: "flex",
              justifyContent: "center", alignItems: "center", bottom: 10, right: 140, cursor: "pointer",
            }}
            title={tr("remove_image", lang)}
            onClick={(e) => {
              e.preventDefault();
              setImagePreview(imageNotFound);
              setUser({ ...user, avatar: null, });
            }}
          >
            x
          </div>
        </div>
      </div>
      {[
        { lk: "name", v: user.name, f: "name" as const, },
        { lk: "email", v: user.email, f: "email" as const, },
      ].map(({ lk, v, f }) => (
        <div key={f} style={{ width: "100%", marginTop: lk === "name" ? 15 : 0 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            {tr(lk, lang)}
          </label>
          <input
            value={v}
            onChange={(e) => setUser({ ...user, [f]: e.target.value })}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "2px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text-primary)",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1A365D")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      ))}
      <div style={{ width: "50%", margin: "20px auto", }}>
        <button 
          style={{ 
            border: ".5px solid #c2c2c2", padding: "10px", width: "100%", 
            borderRadius: 10, color: "#fff", background: "#3e9149", 
            cursor: "pointer",
          }}
          title={tr("save", lang)}
          onClick={saveUser}
        > {tr("save", lang)} </button>
      </div>
    </div>
  );
};

export default ProfilePage;
