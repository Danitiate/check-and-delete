import { keymap } from "@codemirror/view"
import { EditorState, Prec } from "@codemirror/state"
import { Plugin } from "obsidian";

function dummyKeymap(tag: string) {
    return keymap.of([{
        key: "Ctrl-Space",
        run() { 
            console.log(tag); 
            return true 
        }
    }])
}


function addEnterKeyInterceptor(plugin: Plugin) {
    let state = EditorState.create({
        extensions: dummyKeymap("A")
    });

    

    plugin.registerEditorExtension([
        dummyKeymap("A"),
        dummyKeymap("B"),
        Prec.high(dummyKeymap("C"))]
    );
}

export default addEnterKeyInterceptor;
