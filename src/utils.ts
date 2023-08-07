export const isCloud = (url: string): boolean => {
    const suffix = url.slice(-2)
   return suffix === "atlassian.net" ? true : false
}