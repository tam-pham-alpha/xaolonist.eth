import * as React from "react"
import { Link, HeadFC, PageProps } from "gatsby"
import { Container } from "../components/Grid"
import { Layout } from "../components/Layout"

const NotFoundPage: React.FC<PageProps> = ({ location }) => {
  const isEn = location?.pathname?.startsWith("/en") || false

  return (
    <Layout blur={false} lang={isEn ? "en" : "vn"}>
      <div className="bg-[#0b0b0f] pt-[1px]">
        <Container>
          <div className="mt-16 mb-20 flex flex-col items-center justify-center min-h-[60vh] text-center lg:mt-24 lg:mb-32">
            <h1 className="text-[2.5rem] mb-6 font-semibold text-white">Page not found</h1>
            <p className="text-[1.1rem] leading-[1.8] mb-8 text-[rgba(255,255,255,0.8)] max-w-[480px]">
              Sorry 😔, we couldn’t find what you were looking for.
              {process.env.NODE_ENV === "development" ? (
                <>
                  <br />
                  <br />
                  Try creating a page in <code className="text-white px-2 py-1 bg-white/10 text-[0.95rem] rounded font-mono">src/pages/</code>.
                </>
              ) : null}
            </p>
            <Link to={isEn ? "/en/" : "/"} className="inline-block px-7 py-3 bg-white text-black font-medium rounded-md transition-all duration-300 no-underline hover:no-underline hover:bg-[#e0e0e0] hover:-translate-y-px">Go home</Link>
          </div>
        </Container>
      </div>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Page Not Found</title>

