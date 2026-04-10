import { describe, it, expect, beforeEach } from 'vitest'
import { createTestApp } from '../../helpers/testApp'
import { createMockContext } from '../../helpers/mockContext'
import { createNtCallRoutes } from '@/webui/BE/routes/webqq/ntcall'

describe('ntcall routes', () => {
  let ctx: ReturnType<typeof createMockContext>

  beforeEach(() => {
    ctx = createMockContext()
  })

  describe('POST /ntcall/:service/:method', () => {
    it('rejects disallowed service names', async () => {
      const app = createTestApp(createNtCallRoutes(ctx))

      const res = await app.request('/ntcall/ntSystemApi/getDeviceInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ args: [] }),
      })
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.message).toContain('不支持的服务')
    })

    it('rejects arbitrary service names (security)', async () => {
      const app = createTestApp(createNtCallRoutes(ctx))

      for (const service of ['process', 'fs', 'child_process', 'store']) {
        const res = await app.request(`/ntcall/${service}/exec`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ args: [] }),
        })
        expect(res.status).toBe(400)
      }
    })

    it('returns 400 when method is not a function', async () => {
      ctx.ntUserApi.nonExistentMethod = 'not-a-function'
      const app = createTestApp(createNtCallRoutes(ctx))

      const res = await app.request('/ntcall/ntUserApi/nonExistentMethod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ args: [] }),
      })
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.message).toContain('没有方法')
    })

    it('calls allowed service method with args', async () => {
      ctx.ntUserApi.getUinByUid.mockResolvedValue('654321')
      const app = createTestApp(createNtCallRoutes(ctx))

      const res = await app.request('/ntcall/ntUserApi/getUinByUid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ args: ['uid-123'] }),
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.data).toBe('654321')
      expect(ctx.ntUserApi.getUinByUid).toHaveBeenCalledWith('uid-123')
    })

    it('serializes Map results', async () => {
      const resultMap = new Map([['key1', 'val1'], ['key2', 'val2']])
      ctx.ntGroupApi.getGroupMembers.mockResolvedValue(resultMap)
      const app = createTestApp(createNtCallRoutes(ctx))

      const res = await app.request('/ntcall/ntGroupApi/getGroupMembers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ args: ['12345'] }),
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data).toEqual({ key1: 'val1', key2: 'val2' })
    })

    it('returns 500 on call failure', async () => {
      ctx.ntUserApi.getUinByUid.mockRejectedValue(new Error('internal'))
      const app = createTestApp(createNtCallRoutes(ctx))

      const res = await app.request('/ntcall/ntUserApi/getUinByUid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ args: ['uid'] }),
      })
      expect(res.status).toBe(500)
    })
  })
})
