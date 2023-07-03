export default function Footer() {
  return (
    <footer className="p-6 text-center text-white/80 sm:p-12">
      Made with 🤍 by{' '}
      <a
        href="https://willianjusten.com.br"
        target="_blank"
        className="font-semibold hover:text-white"
        rel="noreferrer"
      >
        me
      </a>{' '}
      using this{' '}
      <a
        href="https://github.com/vercel/next.js/tree/canary/examples/with-cloudinary"
        target="_blank"
        className="font-semibold hover:text-white"
        rel="noreferrer"
      >
        amazing NextJS template.
      </a>
    </footer>
  )
}
