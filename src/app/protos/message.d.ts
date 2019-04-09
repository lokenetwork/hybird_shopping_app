import * as $protobuf from "protobufjs";
export namespace main {

    interface IWSMessage {
        type?: (string|null);
        content?: (Uint8Array|null);
    }

    class WSMessage implements IWSMessage {
        constructor(properties?: main.IWSMessage);
        public type: string;
        public content: Uint8Array;
        public static create(properties?: main.IWSMessage): main.WSMessage;
        public static encode(message: main.IWSMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: main.IWSMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): main.WSMessage;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): main.WSMessage;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): main.WSMessage;
        public static toObject(message: main.WSMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IAuthMessage {
        token?: (string|null);
    }

    class AuthMessage implements IAuthMessage {
        constructor(properties?: main.IAuthMessage);
        public token: string;
        public static create(properties?: main.IAuthMessage): main.AuthMessage;
        public static encode(message: main.IAuthMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: main.IAuthMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): main.AuthMessage;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): main.AuthMessage;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): main.AuthMessage;
        public static toObject(message: main.AuthMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }

    interface IMessage {
        from?: (string|null);
        messageType?: (string|null);
        fromUserId?: (number|null);
        toUserId?: (number|null);
        content?: (string|null);
    }

    class Message implements IMessage {
        constructor(properties?: main.IMessage);
        public from: string;
        public messageType: string;
        public fromUserId: number;
        public toUserId: number;
        public content: string;
        public static create(properties?: main.IMessage): main.Message;
        public static encode(message: main.IMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: main.IMessage, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): main.Message;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): main.Message;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): main.Message;
        public static toObject(message: main.Message, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
    }
}
