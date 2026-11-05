export default function Footer() {
  return (
    <footer className="cc-footer">
      <div className="cc-footer-inner">
        <div>
          <h2>🍒 Cherry Cake</h2>
          <p>Handmade desserts for your sweetest moments.</p>
        </div>

        <p className="cc-footer-copy">
          © {new Date().getFullYear()} Cherry Cake. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
