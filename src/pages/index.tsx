export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl border-t-4 border-primary">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl font-bold text-primary mb-4">
            Miku-Dashboard 🎤💚
          </h2>
          <p className="text-base-content/70">
            Tailwind v4 & DaisyUI v5 무대 세팅 완료! 🎹✨
          </p>
          <div className="card-actions mt-6">
            <button className="btn btn-primary">공연 시작! 🎷</button>
            <button className="btn btn-ghost">리허설(Docs) 🎻</button>
          </div>
        </div>
      </div>
    </div>
  );
}
