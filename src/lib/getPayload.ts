import { getPayload as getPayloadInstance } from 'payload'
import config from '@payload-config'

/**
 * Trả về instance Payload dùng chung (Local API) cho server component.
 * KHÔNG gọi REST/GraphQL từ server — dùng trực tiếp Local API cho nhanh.
 */
export const getPayloadClient = async () => {
  return getPayloadInstance({ config })
}
