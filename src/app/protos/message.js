/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.main = (function() {
    
        /**
         * Namespace main.
         * @exports main
         * @namespace
         */
        var main = {};
    
        main.WSMessage = (function() {
    
            /**
             * Properties of a WSMessage.
             * @memberof main
             * @interface IWSMessage
             * @property {string|null} [type] WSMessage type
             * @property {Uint8Array|null} [content] WSMessage content
             */
    
            /**
             * Constructs a new WSMessage.
             * @memberof main
             * @classdesc Represents a WSMessage.
             * @implements IWSMessage
             * @constructor
             * @param {main.IWSMessage=} [properties] Properties to set
             */
            function WSMessage(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * WSMessage type.
             * @member {string} type
             * @memberof main.WSMessage
             * @instance
             */
            WSMessage.prototype.type = "";
    
            /**
             * WSMessage content.
             * @member {Uint8Array} content
             * @memberof main.WSMessage
             * @instance
             */
            WSMessage.prototype.content = $util.newBuffer([]);
    
            /**
             * Creates a new WSMessage instance using the specified properties.
             * @function create
             * @memberof main.WSMessage
             * @static
             * @param {main.IWSMessage=} [properties] Properties to set
             * @returns {main.WSMessage} WSMessage instance
             */
            WSMessage.create = function create(properties) {
                return new WSMessage(properties);
            };
    
            /**
             * Encodes the specified WSMessage message. Does not implicitly {@link main.WSMessage.verify|verify} messages.
             * @function encode
             * @memberof main.WSMessage
             * @static
             * @param {main.IWSMessage} message WSMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WSMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && message.hasOwnProperty("type"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
                if (message.content != null && message.hasOwnProperty("content"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.content);
                return writer;
            };
    
            /**
             * Encodes the specified WSMessage message, length delimited. Does not implicitly {@link main.WSMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof main.WSMessage
             * @static
             * @param {main.IWSMessage} message WSMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WSMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a WSMessage message from the specified reader or buffer.
             * @function decode
             * @memberof main.WSMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {main.WSMessage} WSMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WSMessage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.main.WSMessage();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type = reader.string();
                        break;
                    case 2:
                        message.content = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a WSMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof main.WSMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {main.WSMessage} WSMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WSMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a WSMessage message.
             * @function verify
             * @memberof main.WSMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            WSMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    if (!$util.isString(message.type))
                        return "type: string expected";
                if (message.content != null && message.hasOwnProperty("content"))
                    if (!(message.content && typeof message.content.length === "number" || $util.isString(message.content)))
                        return "content: buffer expected";
                return null;
            };
    
            /**
             * Creates a WSMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof main.WSMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {main.WSMessage} WSMessage
             */
            WSMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.main.WSMessage)
                    return object;
                var message = new $root.main.WSMessage();
                if (object.type != null)
                    message.type = String(object.type);
                if (object.content != null)
                    if (typeof object.content === "string")
                        $util.base64.decode(object.content, message.content = $util.newBuffer($util.base64.length(object.content)), 0);
                    else if (object.content.length)
                        message.content = object.content;
                return message;
            };
    
            /**
             * Creates a plain object from a WSMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof main.WSMessage
             * @static
             * @param {main.WSMessage} message WSMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            WSMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type = "";
                    if (options.bytes === String)
                        object.content = "";
                    else {
                        object.content = [];
                        if (options.bytes !== Array)
                            object.content = $util.newBuffer(object.content);
                    }
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = message.type;
                if (message.content != null && message.hasOwnProperty("content"))
                    object.content = options.bytes === String ? $util.base64.encode(message.content, 0, message.content.length) : options.bytes === Array ? Array.prototype.slice.call(message.content) : message.content;
                return object;
            };
    
            /**
             * Converts this WSMessage to JSON.
             * @function toJSON
             * @memberof main.WSMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            WSMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return WSMessage;
        })();
    
        main.AuthMessage = (function() {
    
            /**
             * Properties of an AuthMessage.
             * @memberof main
             * @interface IAuthMessage
             * @property {string|null} [token] AuthMessage token
             */
    
            /**
             * Constructs a new AuthMessage.
             * @memberof main
             * @classdesc Represents an AuthMessage.
             * @implements IAuthMessage
             * @constructor
             * @param {main.IAuthMessage=} [properties] Properties to set
             */
            function AuthMessage(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * AuthMessage token.
             * @member {string} token
             * @memberof main.AuthMessage
             * @instance
             */
            AuthMessage.prototype.token = "";
    
            /**
             * Creates a new AuthMessage instance using the specified properties.
             * @function create
             * @memberof main.AuthMessage
             * @static
             * @param {main.IAuthMessage=} [properties] Properties to set
             * @returns {main.AuthMessage} AuthMessage instance
             */
            AuthMessage.create = function create(properties) {
                return new AuthMessage(properties);
            };
    
            /**
             * Encodes the specified AuthMessage message. Does not implicitly {@link main.AuthMessage.verify|verify} messages.
             * @function encode
             * @memberof main.AuthMessage
             * @static
             * @param {main.IAuthMessage} message AuthMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.token != null && message.hasOwnProperty("token"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.token);
                return writer;
            };
    
            /**
             * Encodes the specified AuthMessage message, length delimited. Does not implicitly {@link main.AuthMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof main.AuthMessage
             * @static
             * @param {main.IAuthMessage} message AuthMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an AuthMessage message from the specified reader or buffer.
             * @function decode
             * @memberof main.AuthMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {main.AuthMessage} AuthMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthMessage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.main.AuthMessage();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 3:
                        message.token = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an AuthMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof main.AuthMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {main.AuthMessage} AuthMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an AuthMessage message.
             * @function verify
             * @memberof main.AuthMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AuthMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.token != null && message.hasOwnProperty("token"))
                    if (!$util.isString(message.token))
                        return "token: string expected";
                return null;
            };
    
            /**
             * Creates an AuthMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof main.AuthMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {main.AuthMessage} AuthMessage
             */
            AuthMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.main.AuthMessage)
                    return object;
                var message = new $root.main.AuthMessage();
                if (object.token != null)
                    message.token = String(object.token);
                return message;
            };
    
            /**
             * Creates a plain object from an AuthMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof main.AuthMessage
             * @static
             * @param {main.AuthMessage} message AuthMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AuthMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.token = "";
                if (message.token != null && message.hasOwnProperty("token"))
                    object.token = message.token;
                return object;
            };
    
            /**
             * Converts this AuthMessage to JSON.
             * @function toJSON
             * @memberof main.AuthMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AuthMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return AuthMessage;
        })();
    
        main.Message = (function() {
    
            /**
             * Properties of a Message.
             * @memberof main
             * @interface IMessage
             * @property {string|null} [from] Message from
             * @property {string|null} [messageType] Message messageType
             * @property {number|null} [fromUserId] Message fromUserId
             * @property {number|null} [toUserId] Message toUserId
             * @property {string|null} [content] Message content
             */
    
            /**
             * Constructs a new Message.
             * @memberof main
             * @classdesc Represents a Message.
             * @implements IMessage
             * @constructor
             * @param {main.IMessage=} [properties] Properties to set
             */
            function Message(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Message from.
             * @member {string} from
             * @memberof main.Message
             * @instance
             */
            Message.prototype.from = "";
    
            /**
             * Message messageType.
             * @member {string} messageType
             * @memberof main.Message
             * @instance
             */
            Message.prototype.messageType = "";
    
            /**
             * Message fromUserId.
             * @member {number} fromUserId
             * @memberof main.Message
             * @instance
             */
            Message.prototype.fromUserId = 0;
    
            /**
             * Message toUserId.
             * @member {number} toUserId
             * @memberof main.Message
             * @instance
             */
            Message.prototype.toUserId = 0;
    
            /**
             * Message content.
             * @member {string} content
             * @memberof main.Message
             * @instance
             */
            Message.prototype.content = "";
    
            /**
             * Creates a new Message instance using the specified properties.
             * @function create
             * @memberof main.Message
             * @static
             * @param {main.IMessage=} [properties] Properties to set
             * @returns {main.Message} Message instance
             */
            Message.create = function create(properties) {
                return new Message(properties);
            };
    
            /**
             * Encodes the specified Message message. Does not implicitly {@link main.Message.verify|verify} messages.
             * @function encode
             * @memberof main.Message
             * @static
             * @param {main.IMessage} message Message message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Message.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.from != null && message.hasOwnProperty("from"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.from);
                if (message.messageType != null && message.hasOwnProperty("messageType"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.messageType);
                if (message.fromUserId != null && message.hasOwnProperty("fromUserId"))
                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.fromUserId);
                if (message.toUserId != null && message.hasOwnProperty("toUserId"))
                    writer.uint32(/* id 7, wireType 0 =*/56).int32(message.toUserId);
                if (message.content != null && message.hasOwnProperty("content"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.content);
                return writer;
            };
    
            /**
             * Encodes the specified Message message, length delimited. Does not implicitly {@link main.Message.verify|verify} messages.
             * @function encodeDelimited
             * @memberof main.Message
             * @static
             * @param {main.IMessage} message Message message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Message.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Message message from the specified reader or buffer.
             * @function decode
             * @memberof main.Message
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {main.Message} Message
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Message.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.main.Message();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 4:
                        message.from = reader.string();
                        break;
                    case 5:
                        message.messageType = reader.string();
                        break;
                    case 6:
                        message.fromUserId = reader.int32();
                        break;
                    case 7:
                        message.toUserId = reader.int32();
                        break;
                    case 8:
                        message.content = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Message message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof main.Message
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {main.Message} Message
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Message.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Message message.
             * @function verify
             * @memberof main.Message
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Message.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.from != null && message.hasOwnProperty("from"))
                    if (!$util.isString(message.from))
                        return "from: string expected";
                if (message.messageType != null && message.hasOwnProperty("messageType"))
                    if (!$util.isString(message.messageType))
                        return "messageType: string expected";
                if (message.fromUserId != null && message.hasOwnProperty("fromUserId"))
                    if (!$util.isInteger(message.fromUserId))
                        return "fromUserId: integer expected";
                if (message.toUserId != null && message.hasOwnProperty("toUserId"))
                    if (!$util.isInteger(message.toUserId))
                        return "toUserId: integer expected";
                if (message.content != null && message.hasOwnProperty("content"))
                    if (!$util.isString(message.content))
                        return "content: string expected";
                return null;
            };
    
            /**
             * Creates a Message message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof main.Message
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {main.Message} Message
             */
            Message.fromObject = function fromObject(object) {
                if (object instanceof $root.main.Message)
                    return object;
                var message = new $root.main.Message();
                if (object.from != null)
                    message.from = String(object.from);
                if (object.messageType != null)
                    message.messageType = String(object.messageType);
                if (object.fromUserId != null)
                    message.fromUserId = object.fromUserId | 0;
                if (object.toUserId != null)
                    message.toUserId = object.toUserId | 0;
                if (object.content != null)
                    message.content = String(object.content);
                return message;
            };
    
            /**
             * Creates a plain object from a Message message. Also converts values to other types if specified.
             * @function toObject
             * @memberof main.Message
             * @static
             * @param {main.Message} message Message
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Message.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.from = "";
                    object.messageType = "";
                    object.fromUserId = 0;
                    object.toUserId = 0;
                    object.content = "";
                }
                if (message.from != null && message.hasOwnProperty("from"))
                    object.from = message.from;
                if (message.messageType != null && message.hasOwnProperty("messageType"))
                    object.messageType = message.messageType;
                if (message.fromUserId != null && message.hasOwnProperty("fromUserId"))
                    object.fromUserId = message.fromUserId;
                if (message.toUserId != null && message.hasOwnProperty("toUserId"))
                    object.toUserId = message.toUserId;
                if (message.content != null && message.hasOwnProperty("content"))
                    object.content = message.content;
                return object;
            };
    
            /**
             * Converts this Message to JSON.
             * @function toJSON
             * @memberof main.Message
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Message.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Message;
        })();
    
        return main;
    })();

    return $root;
});
