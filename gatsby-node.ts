import { request } from "graphql-request"

type RedirectItem = {
  url: string
  toUrl: string
  code: number
}

type ResultRedirectRequest = {
  data?:{
    redirects:{
      items: Array<RedirectItem>
    }
  }
  error?: {
    errors: Array<{ message: string }>
  }
}

const createPages = async ({ actions }) => {
    const { createRedirect } = actions

    const url = "https://api-app.sovcombank.ru/seo"
    const document = `
    query ($url: String!){
      redirects(filters:{url: $url}){
        items{
          url
          toUrl
          code
        }
      }
    } 
    `
    const variables = { url: "apply/credit" }

    const res: ResultRedirectRequest = await request({
        url,
        document,
        variables,
      })

    res.data?.redirects?.items?.forEach(({ url, toUrl, code}: RedirectItem ) => {

      const parsedUrl = new URL(url)

      createRedirect({ fromPath: parsedUrl.pathname, toPath: toUrl, statusCode: code })
    });

}

export { createPages }