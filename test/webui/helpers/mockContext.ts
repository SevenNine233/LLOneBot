import { vi } from 'vitest'

export function createMockContext() {
  return {
    ntLoginApi: {
      getLoginQrCode: vi.fn(),
      getQuickLoginList: vi.fn(),
      quickLoginWithUin: vi.fn(),
    },
    ntFriendApi: {
      getBuddyList: vi.fn(() => Promise.resolve([])),
      getBuddyReq: vi.fn(() => Promise.resolve({ buddyReqs: [] })),
      getDoubtBuddyReq: vi.fn(() => Promise.resolve({ doubtList: [] })),
      approvalDoubtBuddyReq: vi.fn(() => Promise.resolve()),
      handleFriendRequest: vi.fn(() => Promise.resolve()),
    },
    ntGroupApi: {
      getGroups: vi.fn(() => Promise.resolve([])),
      getGroupMembers: vi.fn(() => Promise.resolve({ result: { infos: new Map() } })),
      getGroupRequest: vi.fn(() => Promise.resolve({ notifies: [], normalCount: 0 })),
      handleGroupRequest: vi.fn(() => Promise.resolve()),
    },
    ntSystemApi: {
      getDeviceInfo: vi.fn(() => Promise.resolve({ os: 'Linux', kernel: '5.4' })),
    },
    ntMsgApi: {
      getMsgsBySeqAndCount: vi.fn(() => Promise.resolve({ msgList: [] })),
      getAioFirstViewLatestMsgs: vi.fn(() => Promise.resolve({ msgList: [] })),
      sendMsg: vi.fn(() => Promise.resolve({ msgId: 'mock-msg-id' })),
    },
    ntUserApi: {
      getUinByUid: vi.fn(() => Promise.resolve('654321')),
      getUidByUin: vi.fn(() => Promise.resolve('mock-uid')),
      getUserSimpleInfo: vi.fn(() => Promise.resolve({
        uid: 'mock-uid',
        coreInfo: { nick: 'MockUser', remark: '' },
      })),
    },
    ntFileApi: {
      rkeyManager: { getRkey: vi.fn(() => Promise.resolve({ private_rkey: '', group_rkey: '' })) },
      getPttUrl: vi.fn(),
    },
    emailNotification: null as any,
    logger: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    },
    get: vi.fn(),
    on: vi.fn(() => vi.fn()),
    parallel: vi.fn(),
  } as any
}
