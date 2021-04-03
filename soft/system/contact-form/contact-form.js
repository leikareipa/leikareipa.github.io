import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.min.js";

new Vue({
    el:"#contact-form",
    data: {
        isContactEnabled: true,

        isContactButtonAlwaysExpanded: true,
        isContactButtonHovered: false,
        isContactButtonVisible: false,
        isContactButtonEnabled: true,

        isFormVisible: false,
        hasFormEverBeenOpened: false,
        hasFeedbackBeenSent: false,

        isWaitingForServerResponse: false,
        serverResponseType: "none", // "success", "failure"

        notificationMessage: "",

        maxFeedbackLength: 2560,
    },
    watch: {
        isFormVisible(itIs)
        {
            if (itIs && !this.hasFeedbackBeenSent)
            {
                Vue.nextTick(()=>
                {
                    this.$refs["input-field-feedback"].focus();
                });
            }
        },
    },
    methods: {
        handle_click(event)
        {
            if (event.target == this.$refs["tarp"])
            this.isFormVisible = false;
        },
        update_contact_button_for_screen_size()
        {
            this.isContactButtonEnabled = (window.innerWidth > 1230);
            this.isContactButtonAlwaysExpanded = (window.innerWidth > 1400);
        },
        clear_input_fields()
        {
            this.$refs["input-field-feedback"].value = "";
            this.$refs["input-field-email"].value = "";
        },
        send_feedback()
        {
            /// Temporary. Our feedback-sending backend code is currently not available,
            /// so we can't allow feedback.
            return;

            const feedback = (this.$refs["input-field-feedback"].value || null);
            const senderEmail = (this.$refs["input-field-email"].value || null);

            this.isWaitingForServerResponse = true;
            this.notificationMessage = "";

            fetch("./soft/system/send-feedback.php", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    feedback: feedback.trim(),
                    email: senderEmail,
                }),
            })
            .then(response=>
            {
                if (response.ok)
                {
                    this.indicate_form_submission_success(true);
                }
                else
                {
                    this.indicate_form_submission_success(false);
                }
            });
        },
        indicate_form_submission_success(wasSuccess)
        {
            if (wasSuccess)
            {
                this.notificationMessage = "Your feedback has been sent!"
                this.serverResponseType = "success";
                this.hasFeedbackBeenSent = true;
            }
            else
            {
                this.notificationMessage = "Failed to send the feedback!"
                this.serverResponseType = "failure";
                this.hasFeedbackBeenSent = false;
            }

            this.isWaitingForServerResponse = false;
        },
    },
    computed: {
        isContactButtonExpanded()
        {
            return (this.isContactButtonAlwaysExpanded ||
                    this.isContactButtonHovered ||
                    this.isFormVisible);
        },
    },
    mounted()
    {
        this.update_contact_button_for_screen_size();

        /// Temporary. Our feedback-sending backend code is currently not available,
        /// so we can't allow feedback.
        this.notificationMessage = "Feedback functionality is unavailable at this time"
        this.serverResponseType = "success";

        window.addEventListener("scroll", ()=>
        {
            this.isContactButtonVisible = (window.scrollY > (window.innerHeight / 3.5));
        });

        window.addEventListener("resize", ()=>
        {
            this.update_contact_button_for_screen_size();
        });
    },
    template: `
        <div class="contact-form"
             v-if="isContactEnabled"
             v-on:click="handle_click">
        
            <link rel="stylesheet"
                  type="text/css"
                  href="./soft/system/contact-form/contact-form.css">

            <transition name="fade">
            
                <div class="contact-button"
                     title="Send feedback to Tarpeeksi Hyvae Soft"
                     v-if="isContactButtonEnabled && isContactButtonVisible"
                     v-on:mouseenter="(isContactButtonHovered = true)"
                     v-on:mouseleave="(isContactButtonHovered = false)"
                     v-on:click="(isFormVisible = true, hasFormEverBeenOpened = true)"
                     v-bind:class="{expanded: isContactButtonExpanded}">
                
                    {{isContactButtonExpanded? "Feedback" : ""}}

                    <i v-bind:class="{'fas fa-envelope-open': !hasFeedbackBeenSent,
                                      'fas fa-envelope': hasFeedbackBeenSent}"></i>
                    
                </div>

            </transition>

            <div class="tarp"
                 v-if="isFormVisible"
                 ref="tarp"></div>

            <form class="contact-form-body"
                  ref="form-body"
                  v-on:submit.prevent="send_feedback"
                  v-show="isFormVisible"
                  v-if="hasFormEverBeenOpened">

                <div class="meat">

                    <label>Feedback to Tarpeeksi Hyvae Soft</label>
                    <textarea id='feedback'
                              ref='input-field-feedback'
                              name='feedback'
                              v-bind:maxlength="maxFeedbackLength"
                              v-bind:readonly="(isWaitingForServerResponse || hasFeedbackBeenSent)"
                              required></textarea>

                    <label>Your email address (if you'd like a response)</label>
                    <input type='email'
                           ref='input-field-email'
                           name='email'
                           id='email'
                           v-bind:readonly="(isWaitingForServerResponse || hasFeedbackBeenSent)"
                           placeholder='me@example.com (optional)'>

                </div>

                <footer>

                    <span class="notification"
                            v-bind:class="serverResponseType">

                        {{notificationMessage}}
                    
                    </span>

                    <div class="buttons">

                        <button type='submit'
                                class='submit-ok'
                                v-if="!hasFeedbackBeenSent"
                                v-bind:class="{waiting: isWaitingForServerResponse}"
                                v-bind:disabled="isWaitingForServerResponse">

                            <i class='fas fa-spin fa-spinner'
                               style="margin-right: 7px;"
                               v-if="isWaitingForServerResponse"></i>

                            {{isWaitingForServerResponse
                              ? "Sending"
                              : "Send feedback"}}

                        </button>

                        <button type="button"
                                class="submit-cancel"
                                v-on:click="(isFormVisible = false)">

                            Close

                        </button>

                    </div>

                </footer>

            </form>

        </div>
    `,
});
