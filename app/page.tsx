export default function Home() {
  return (
    <div
      className="hero min-h-screen"
      style={{ backgroundImage: `url("/bg.jpg")` }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-2xl">
          <p className="mb-6 text-5xl">
            Trustless end of life digital legacy management{" "}
          </p>
          <button className="btn btn-primary">Connect Wallet</button>
        </div>
      </div>
    </div>
  );
}
