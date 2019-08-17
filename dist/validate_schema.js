"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var schema = {
  announcement_post_body: {
    "type": "object",
    "properties": {
      "text": {
        "type": "string"
      },
      "image": {
        "type": "string"
      }
    },
    "required": ["text"]
  },
  announcement_update_body: {
    "type": "object",
    "minProperties": 1,
    "properties": {
      "text": {
        "type": "string"
      },
      "image": {
        "type": "string"
      }
    }
  },
  userId_get_query: {
    "type": "object",
    "properties": {
      "userid": {
        "type": "string"
      }
    },
    "required": ["userid"]
  },
  userId_put_body: {
    type: "object",
    properties: {
      name: {
        type: "string"
      },
      avatar: {
        type: "string"
      },
      signature: {
        type: "string"
      }
    },
    required: ["name", "avatar", "signature"]
  }
};
var _default = schema;
exports["default"] = _default;
//# sourceMappingURL=validate_schema.js.map