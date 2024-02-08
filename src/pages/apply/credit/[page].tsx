import * as React from "react"
import { request } from "graphql-request"

type SeoPage = {
    title: string
    description: string
    url: string
    upperBannerImage: string
}

type PageProps = {
    serverData: SeoPage
}

type GetServerDataContext = {
    params: {
        page: string
    },
    url: string, // url: '/page-data/ssr/64da91fa00d6e36cb9d3f1d3/page-data.json?dd=dsd',
    query: Record<string, string>
}

type ResponseSeo = {
    seo: SeoPage
}

const SSRPage = ({ serverData }: PageProps) => (
  <main>
    <h1>{serverData.title}</h1>
    <h2>{serverData.description}</h2>
    <a href={serverData.url}>link</a>
    <img src={serverData.upperBannerImage}/>n
  </main>
)

export default SSRPage

export async function getServerData(context: GetServerDataContext) {
  try {

    const url = "https://api-app.sovcombank.ru/seo"
    const document = `
    query getSeoPage($url: String!){
        seo(url: $url){
        url
        title
        description
        upperBannerImage
      }
    }    
    `
    const variables = { url: `https://sovcombank.ru/apply/credit/${context.params.page}/` }

    const res: ResponseSeo = await request({
        url,
        document,
        variables,
      })

    // doesn't work in express
    if(!res.seo) {
      throw new Error("Page not found")
    }

    return {
      props: res.seo
    }
  } catch (error) {

    return {
      status: 404,
      headers: {},
      props: {}
    }
  }
}