import { action } from "@ember/object";
import { getOwner } from "discourse-common/lib/get-owner";
import Composer from "discourse/models/composer";
import DropdownSelectBoxComponent from "select-kit/components/dropdown-select-box";
import { computed } from "@ember/object";
import AccountDeletionModal from "../components/modal/account-deletion-modal";
import I18n from "I18n";

export default DropdownSelectBoxComponent.extend({
  classNames: ["account-deletion-request"],

  selectKitOptions: {
    icons: [settings.dropdown_button_icon],
    showFullTitle: true,
    autoFilterable: false,
    filterable: false,
    showCaret: true,
    none: themePrefix("account_deletion.dropdown.button_text"),
  },

  content: computed(function () {
    
    const userCanSendPm = this.currentUser?.can_send_private_messages;
    
    const items = [
      {
        id: "more_info",
        name: I18n.t(themePrefix("account_deletion.dropdown.info.item_name")),
        description: I18n.t(themePrefix("account_deletion.dropdown.info.item_description")),
        icon: settings.info_dropdown_item_icon,
      },
    ];
    if (userCanSendPm) {
      items.push({
        id: "delete_request",
        name: I18n.t(themePrefix("account_deletion.dropdown.request.item_name")),
        description: I18n.t(themePrefix("account_deletion.dropdown.request.item_description")),
        icon: settings.request_dropdown_item_icon,
      });
    }
    return items;
  }),

  @action
  onChange(selectedAction) {
  
    if (selectedAction === "delete_request") {
      const composerController = getOwner(this).lookup("controller:composer");
      
      composerController.open({
        action: Composer.PRIVATE_MESSAGE,
        draftKey: Composer.NEW_PRIVATE_MESSAGE_KEY,
        recipients: settings.pm_recipients,
        topicTitle: I18n.t(themePrefix("account_deletion.pm.title")),
        topicBody: I18n.t(themePrefix("account_deletion.pm.body")),
        archetypeId: "private_message",
      });
    }
    
    if (selectedAction === "more_info") {
      const modal = getOwner(this).lookup("service:modal");
      
      modal.show(AccountDeletionModal);
    }
  },
});
