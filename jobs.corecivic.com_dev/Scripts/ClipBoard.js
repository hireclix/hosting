var ClipBoard = kendo.Class.extend({
    _targets: null,
    _clip:[],
    _isCopying: false,
    isCopying: function (isCopying) {
        if (!isCopying) return this._isCopying;

        this._isCopying = isCopying;

        return this;
    },
    clip: function (cb) {
        if (!cb) return this._clip;

        this._clip.push(cb);

        return cb;
    },
    init: function (targets, success, failure) {
        var self = this;
        if (targets) self._targets = targets;

        $(targets).each(function (i, n) {
            var clip = self.clip(new ZeroClipboard($(n)));
            clip.currentTarget = $(n);

            clip.on('copy', function (event) {
                var text = $("#" + $(clip.currentTarget).data("clipboard-target")).val();
                var windowsText = text.replace(/\n/g, '\r\n');

                event.clipboardData.setData('text/plain', windowsText);
            });

            clip.on('beforecopy', function (e) {
                if (self.isCopying()) return;

                self.isCopying(true);
            });

            clip.on('aftercopy', function (e) {
                success(e.target);
                self.isCopying(false);
            });

            clip.on('error', function (e) {
                clip.currentTarget.on("click", function (e) {
                    //debugger;
                    var message = $("#" + $(this).data("clipboard-target")).val();

                    self.isCopying(true);
                    var ok = self.Copy(message);

                    if (ok) {
                        success(e.currentTarget);
                    } else {
                        failure(e.currentTarget);
                    }
                    self.isCopying(false);
                });
                clip.destroy();
            });
        });
    },

    Copy: function (textToClipboard) {
        var success = true;

        function createElementForExecCommand(text) {
            var forExecElement = document.createElement("div");
            // place outside the visible area
            forExecElement.style.position = "absolute";
            forExecElement.style.left = "-10000px";
            forExecElement.style.top = "-10000px";
            // write the necessary text into the element and append to the document
            forExecElement.textContent = text;
            document.body.appendChild(forExecElement);
            // the contentEditable mode is necessary for the  execCommand method in Firefox
            forExecElement.contentEditable = true;

            return forExecElement;
        }

        function selectContent(element) {
            // first create a range
            var rangeToSelect = document.createRange();
            rangeToSelect.selectNodeContents(element);

            // select the contents
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(rangeToSelect);
        }

        if (window.clipboardData) { // Internet Explorer
            window.clipboardData.setData("Text", textToClipboard);
        }
        else {
            // create a temporary element for the execCommand method
            var forExecElement = createElementForExecCommand(textToClipboard);

            /* Select the contents of the element 
                (the execCommand for 'copy' method works on the selection) */
            selectContent(forExecElement);

            //var supported = true;

            // UniversalXPConnect privilege is required for clipboard access in Firefox
            try {
                if (window.netscape && netscape.security) {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                }

                // Copy the selected content to the clipboard
                // Works in Firefox and in Safari before version 5
                success = document.execCommand("copy", false, null);
            }
            catch (e) {
                success = false;
            }

            // remove the temporary element
            document.body.removeChild(forExecElement);
        }

        return success;
    }
});