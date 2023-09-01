import { useDevtoolsClient } from './client'

const client = useDevtoolsClient()

export const hookApi = {
  hook: client.hook,
}
