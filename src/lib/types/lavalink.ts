import {
  DebugEvents,
  DestroyReasonsType,
  InvalidLavalinkRestRequest,
  LavalinkNode,
  LavalinkPlayer,
  LyricsFoundEvent,
  LyricsLineEvent,
  LyricsNotFoundEvent,
  Player,
  PlayerJson,
  SponsorBlockChaptersLoaded,
  SponsorBlockChapterStarted,
  SponsorBlockSegmentSkipped,
  SponsorBlockSegmentsLoaded,
  Track,
  TrackEndEvent,
  TrackExceptionEvent,
  TrackStartEvent,
  TrackStuckEvent,
  UnresolvedTrack,
  WebSocketClosedEvent,
} from "lavalink-client/dist/types";

export interface PlayerEvents {
  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when Chapters are loaded
   * @link https://github.com/topi314/Sponsorblock-Plugin#chaptersloaded
   * @event Manager#trackError
   */
  ChaptersLoaded: [
    player: Player,
    track: null | Track | UnresolvedTrack,
    payload: SponsorBlockChaptersLoaded,
  ];
  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when a specific Chapter starts playing
   * @link https://github.com/topi314/Sponsorblock-Plugin#chapterstarted
   * @event Manager#trackError
   */
  ChapterStarted: [
    player: Player,
    track: null | Track | UnresolvedTrack,
    payload: SponsorBlockChapterStarted,
  ];
  /**
   * Lavalink-Client Debug Event
   * Emitted for several erros, and logs within lavalink-client, if managerOptions.advancedOptions.enableDebugEvents is true
   * Useful for debugging the lavalink-client
   *
   * @event Manager#debug
   */
  debug: [
    eventKey: DebugEvents,
    eventData: {
      error?: Error | string;
      functionLayer: string;
      message: string;
      state: "error" | "log" | "warn";
    },
  ];
  /**
   * Emitted when a Lyrics is found
   * @link https://github.com/topi314/LavaLyrics
   * @event Manager#LyricsFound
   */
  LyricsFound: [
    player: Player,
    track: null | Track | UnresolvedTrack,
    payload: LyricsFoundEvent,
  ];
  /**
   * Emitted when a Lyrics line is received
   * @link https://github.com/topi314/LavaLyrics
   * @event Manager#LyricsLine
   */
  LyricsLine: [
    player: Player,
    track: null | Track | UnresolvedTrack,
    payload: LyricsLineEvent,
  ];
  /**
   * Emitted when a Lyrics is not found
   * @link https://github.com/topi314/LavaLyrics
   * @event Manager#LyricsNotFound
   */
  LyricsNotFound: [
    player: Player,
    track: null | Track | UnresolvedTrack,
    payload: LyricsNotFoundEvent,
  ];
  /**
   * Emitted when a Player is created.
   * @event Manager#playerCreate
   */
  playerCreate: [player: Player];
  /**
   * Emitted when the player's selfDeafed or serverDeafed state changed [true -> false | false -> true)
   * @event Manager#playerDeafChange
   */
  playerDeafChange: [
    player: Player,
    selfDeafed: boolean,
    serverDeafed: boolean,
  ];
  /**
   * Emitted when a Player get's destroyed
   * @event Manager#playerDestroy
   */
  playerDestroy: [player: Player, destroyReason?: DestroyReasonsType];
  /**
   * Emitted when a Player is disconnected from a channel.
   * @event Manager#playerDisconnect
   */
  playerDisconnect: [player: Player, voiceChannelId: string];
  /**
   * Emitted when a Player is moved within the channel.
   * @event Manager#playerMove
   */
  playerMove: [
    player: Player,
    oldVoiceChannelId: string,
    newVoiceChannelId: string,
  ];
  /**
   * Emitted when the player's selfMuted or serverMuted state changed [true -> false | false -> true)
   * @event Manager#playerMuteChange
   */
  playerMuteChange: [player: Player, selfMuted: boolean, serverMuted: boolean];
  /**
   * Emitted when the player's queue got empty, and the timeout got cancelled becuase a track got re-added to it.
   * @event Manager#playerQueueEmptyEnd
   */
  playerQueueEmptyCancel: [player: Player];
  /**
   * Emitted when the player's queue got empty, and the timeout finished leading to destroying the player
   * @event Manager#playerQueueEmptyEnd
   */
  playerQueueEmptyEnd: [player: Player];
  /**
   * Emitted when the player's queue got empty, and the timeout started
   * @event Manager#playerQueueEmptyStart
   */
  playerQueueEmptyStart: [player: Player, timeoutMs: number];
  /**
   * Emitted when a Node-Socket got closed for a specific Player.
   * Usually emits when the audio websocket to discord is closed, This can happen for various reasons [normal and abnormal), e.g. when using an expired voice server update. 4xxx codes are usually bad.
   *
   * So this is just information, normally lavalink should handle disconnections
   *
   * Discord Docs:
   * @link https://discord.com/developers/docs/topics/opcodes-and-status-codes#voice-voice-close-event-codes
   *
   * Lavalink Docs:
   * @link https://lavalink.dev/api/websocket.html#websocketclosedevent
   * @event Manager#playerSocketClosed
   */
  playerSocketClosed: [player: Player, payload: WebSocketClosedEvent];
  /**
   * Emitted when the player's suppressed [true -> false | false -> true)
   * @event Manager#playerSuppressChange
   */
  playerSuppressChange: [player: Player, suppress: boolean];
  /**
   * Always emits when the player [on lavalink side) got updated
   * @event Manager#playerUpdate
   */
  playerUpdate: [oldPlayerJson: PlayerJson, newPlayer: Player];
  /**
   * Emitted, when a user joins the voice channel, while there is a player existing
   * @event Manager#playerQueueEmptyStart
   */
  playerVoiceJoin: [player: Player, userId: string];
  /**
   * Emitted, when a user leaves the voice channel, while there is a player existing
   * @event Manager#playerQueueEmptyEnd
   */
  playerVoiceLeave: [player: Player, userId: string];
  /**
   * Emitted when the Playing finished and no more tracks in the queue.
   * @event Manager#queueEnd
   */
  queueEnd: [
    player: Player,
    track: null | Track | UnresolvedTrack,
    payload: TrackEndEvent | TrackExceptionEvent | TrackStuckEvent,
  ];
  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when a specific Segment was skipped
   * @link https://github.com/topi314/Sponsorblock-Plugin#segmentskipped
   * @event Manager#trackError
   */
  SegmentSkipped: [
    player: Player,
    track: null | Track | UnresolvedTrack,
    payload: SponsorBlockSegmentSkipped,
  ];
  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when Segments are loaded
   * @link https://github.com/topi314/Sponsorblock-Plugin#segmentsloaded
   * @event Manager#trackError
   */
  SegmentsLoaded: [
    player: Player,
    track: null | Track | UnresolvedTrack,
    payload: SponsorBlockSegmentsLoaded,
  ];
  /**
   * Emitted when a Track finished.
   * @event Manager#trackEnd
   */
  trackEnd: [player: Player, track: null | Track, payload: TrackEndEvent];
  /**
   * Emitted when a Track errored.
   * @event Manager#trackError
   */
  trackError: [
    player: Player,
    track: null | Track | UnresolvedTrack,
    payload: TrackExceptionEvent,
  ];
  /**
   * Emitted when a Track started playing.
   * @event Manager#trackStart
   */
  trackStart: [player: Player, track: null | Track, payload: TrackStartEvent];
  /**
   * Emitted when a Track got stuck while playing.
   * @event Manager#trackStuck
   */
  trackStuck: [player: Player, track: null | Track, payload: TrackStuckEvent];
}

export interface NodeEvents {
  /**
   * Emitted when a Node is connected.
   * @event Manager.nodeManager#connect
   */
  connect: [node: LavalinkNode];
  /**
   * Emitted when a Node is created.
   * @event Manager.nodeManager#create
   */
  create: [node: LavalinkNode];
  /**
   * Emitted when a Node is destroyed.
   * @event Manager.nodeManager#destroy
   */
  destroy: [node: LavalinkNode, destroyReason?: DestroyReasonsType];
  /**
   * Emitted when a Node is disconnects.
   * @event Manager.nodeManager#disconnect
   */
  disconnect: [
    node: LavalinkNode,
    reason: {
      code?: number;
      reason?: string;
    },
  ];
  /**
   * Emitted when a Node is error.
   * @event Manager.nodeManager#error
   */
  error: [node: LavalinkNode, error: Error, payload?: unknown];
  /**
   * Emits every single Node event.
   * @event Manager.nodeManager#raw
   */
  raw: [node: LavalinkNode, payload: unknown];
  /**
   * Emitted when a Node is reconnecting.
   * @event Manager.nodeManager#reconnecting
   */
  reconnecting: [node: LavalinkNode];
  /**
   * Emitted When a node starts to reconnect [if you have a reconnection delay, the reconnecting event will be emitted after the retryDelay.)
   * Useful to check wether the internal node reconnect system works or not
   * @event Manager.nodeManager#reconnectinprogress
   */
  reconnectinprogress: [node: LavalinkNode];
  /**
   * Emits when the node connects resumed. You then need to create all players within this event for your usecase.
   * Aka for that you need to be able to save player data like vc channel + text channel in a db and then sync it again
   * @event Manager.nodeManager#nodeResumed
   */
  resumed: [
    node: LavalinkNode,
    paylaod: {
      op: "ready";
      resumed: true;
      sessionId: string;
    },
    players: InvalidLavalinkRestRequest | LavalinkPlayer[],
  ];
}

export type NodeArgs<K extends keyof NodeEvents> = NodeEvents[K];
export type PlayerArgs<K extends keyof PlayerEvents> = PlayerEvents[K];

export interface LavalinkEvent {
  event: keyof NodeEvents | keyof PlayerEvents;
  propertyKey: string | symbol;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any;
}
