import { Instagram, Twitter, Camera, Computer } from 'components/Icons'

function SocialLinks() {
  return (
    <div className="mt-2 flex items-center justify-center gap-3">
      <a
        href="https://willianjusten.com.br"
        target="_blank"
        className="font-semibold text-white/90 hover:text-white"
        rel="noreferrer"
      >
        <Computer />
      </a>
      <a
        href="https://twitter.com/Willian_justen"
        target="_blank"
        className="font-semibold text-white/90 hover:text-white"
        rel="noreferrer"
      >
        <Twitter />
      </a>

      <a
        href="https://www.instagram.com/will_justen/"
        target="_blank"
        className="font-semibold text-white/90 hover:text-white"
        rel="noreferrer"
      >
        <Instagram />
      </a>

      <a
        href="https://unsplash.com/@willianjusten"
        target="_blank"
        className="font-semibold text-white/90 hover:text-white"
        rel="noreferrer"
      >
        <Camera />
      </a>
    </div>
  )
}

export default SocialLinks
