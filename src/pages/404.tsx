import * as React from "react"
import { Link, HeadFC, PageProps } from "gatsby"
import styled from "styled-components"
import { Container } from "../components/Grid"
import { Layout } from "../components/Layout"

const ScRoot = styled.div`
  background-color: #0b0b0f;
  padding-top: 1px;
`

const ScMain = styled.div`
  margin-top: 4rem;
  margin-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;

  @media screen and (min-width: 992px) {
    margin-top: 6rem;
    margin-bottom: 8rem;
  }
`

const ScHeading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #ffffff;
`

const ScText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 480px;
`

const ScCode = styled.code`
  color: #ffffff;
  padding: 4px 8px;
  background-color: rgba(255, 255, 255, 0.1);
  font-size: 0.95rem;
  border-radius: 4px;
  font-family: Courier, monospace;
`

const ScButton = styled(Link)`
  display: inline-block;
  padding: 12px 28px;
  background-color: #ffffff;
  color: #000000;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-decoration: none !important;

  &:hover {
    background-color: #e0e0e0;
    text-decoration: none !important;
    transform: translateY(-1px);
  }
`

const NotFoundPage: React.FC<PageProps> = ({ location }) => {
  const isEn = location?.pathname?.startsWith("/en") || false

  return (
    <Layout blur={false} lang={isEn ? "en" : "vn"}>
      <ScRoot>
        <Container>
          <ScMain>
            <ScHeading>Page not found</ScHeading>
            <ScText>
              Sorry 😔, we couldn’t find what you were looking for.
              {process.env.NODE_ENV === "development" ? (
                <>
                  <br />
                  <br />
                  Try creating a page in <ScCode>src/pages/</ScCode>.
                </>
              ) : null}
            </ScText>
            <ScButton to={isEn ? "/en/" : "/"}>Go home</ScButton>
          </ScMain>
        </Container>
      </ScRoot>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Page Not Found</title>
