"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands = {
    invoked: {
        test: "app/commands/Test",
        secret: "app/commands/GenerateSecret",
        doc: "app/commands/GenerateDoc",
        seed: "app/commands/Seed"
    },
    nested: {
        make: "app/commands/Make",
        clear: "app/commands/Clear"
    }
};
exports.default = commands;
