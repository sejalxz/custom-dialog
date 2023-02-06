function reload() {
    window.location.href = window.location.href;
}

class Dialog {
    constructor(elem, options = {}) {
        this.elem = document.querySelector(elem);
        this.hasRendered = false;
        this.onSubscribe = this.onSubscribe.bind(this);

        this.options = options;
        this.dialogStyle = options.width && `width:${options.width}`;
        this.width = options.width || "100%";
        this.title = options.title || "Dialog Title";
        this.content = options.content || "Content goes here...";
        this.elem.style.width = this.width; // Assign the width to the parent container

        this.headerStyle = this.toStyleString(options.headerStyle);
        this.bodyStyle = this.toStyleString(options.bodyStyle);

        this.subscribers = [];
        this.data = null;

        if (this.options.onSubscribe && typeof this.options.onSubscribe === "function") {
            this.onSubscribe(this.options.onSubscribe);
        }
    }

    onSubscribe(cb) {
        this.subscribers.push(cb);
    }

    notify(data) {
        this.data = data;
        console.log(this.subscribers.length);
        this.subscribers.forEach((cb) => {
            cb(data);
        });
        // this.clos e();
    }

    toStyleString(style) {
        let result = "";
        if (!style) return result;
        Object.keys(style).forEach((k) => {
            result += `${k}:${style[k]};`
        });
        console.log("style: ", result);
        return result;
    }

    init() {
        let dialogClose = this.elem.querySelector(".dialog-close-icon");
        dialogClose.addEventListener("click", (e) => {
            this.notify("Closed");
            this.close();
        });

        let positiveButton = this.elem.querySelector("button.positive");
        positiveButton.addEventListener("click", (e) => {
            this.notify("Ok");
            this.close();
        })
    }

    didRender() {
        this.init();
    }

    show() {
        if (this.hasRendered) {
            this.elem.style.display = "block";
        }
        else {
            this.elem.innerHTML = this.render();
            this.didRender();
        }
    }

    hide() {
        this.elem.style.display = "none";
    }

    close() {
        this.hasRendered = false;
        this.elem.parentNode.removeChild(this.elem);
        this.subscribers = [];
    }

    render() {
        this.hasRendered = true;
        let ui = (
            ` 
                <div class = 'dialog dialog-wrapper' style=${this.dialogStyle}>
                    <div class = 'dialog-header' style = '${this.headerStyle}'>
                        <header>
                            ${this.title}
                            <span class = 'dialog-close-icon'>❌</span>
                        </header>
                    </div>
                    <div class = 'dialog-body' style = ${this.bodyStyle}>
                        ${this.content}
                    </div>
                    <div class = 'dialog-buttons'>
                        <button class = "button positive"> Ok </button>
                    </div>
                </div>
            `
        );
        return ui;
    }
}

//Simple Dialog
let dialog = new Dialog(
    '#dialog1',
    {
        title: "Dialog Title",
        content: "Content goes here....",
        width: "400px",
        bodyStyle: {
            "background": "white",
            "color": "black",
            "min-height":"40px"
        },
        headerStyle: {
            background: "#bdc3c7"
        },
        onSubscribe: (result) => {
            alert(result);
        }
    }
);

dialog.show();