export const OneToOneChat = {
  SEND_MESSAGE: 'send-message',
  NEW_MESSAGE: 'new-message',
  RECEIVE_MESSAGE: 'receive-message',
  LOAD_MESSAGES: 'load-messages',
  LOAD_CONTACTS: 'load-contacts',
  CONTACTS_UPDATED: 'contacts-updated',
  MESSAGES_LOADED: 'messages-loaded',
  GET_ONLINE_FRIENDS: 'get-online-friends',
} as const;

export type OneToOneChat = (typeof OneToOneChat)[keyof typeof OneToOneChat];

export const GroupChat = {
  GROUP_CREATED: 'group-created',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  USER_REMOVED: 'user-removed',
  GROUP_INFO_UPDATED: 'group-info-updated',
  GROUP_IMAGE_UPDATED: 'group-image-updated',

  SEND_MESSAGE: 'send-group-message', // client → server
  NEW_MESSAGE: 'new-group-message', // server → clients

  LOAD_MESSAGES: 'load-group-messages', // client → server
  MESSAGES_LOADED: 'group-messages-loaded', // server → clients

  LOAD_PARTICIPANTS: 'load-group-participants', // client → server
  PARTICIPANTS_UPDATED: 'group-participants-updated', // server → clients
} as const;

export type GroupChatEvent = (typeof GroupChat)[keyof typeof GroupChat];
