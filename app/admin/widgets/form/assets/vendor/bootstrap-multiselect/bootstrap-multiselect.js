!function(t,e){"function"==typeof define&&define.amd&&"function"==typeof require&&"function"==typeof require.specified&&require.specified("knockout")?define(["jquery","knockout"],e):e(t.jQuery,t.ko)}(this,(function(t,e){"use strict";function i(e,i){this.$select=t(e),this.options=this.mergeOptions(t.extend({},i,this.$select.data())),this.$select.attr("data-placeholder")&&(this.options.nonSelectedText=this.$select.data("placeholder")),this.originalOptions=this.$select.clone()[0].options,this.query="",this.searchTimeout=null,this.lastToggledInput=null,this.options.multiple="multiple"===this.$select.attr("multiple"),this.options.onChange=t.proxy(this.options.onChange,this),this.options.onSelectAll=t.proxy(this.options.onSelectAll,this),this.options.onDeselectAll=t.proxy(this.options.onDeselectAll,this),this.options.onDropdownShow=t.proxy(this.options.onDropdownShow,this),this.options.onDropdownHide=t.proxy(this.options.onDropdownHide,this),this.options.onDropdownShown=t.proxy(this.options.onDropdownShown,this),this.options.onDropdownHidden=t.proxy(this.options.onDropdownHidden,this),this.options.onInitialized=t.proxy(this.options.onInitialized,this),this.options.onFiltering=t.proxy(this.options.onFiltering,this),this.buildContainer(),this.buildButton(),this.buildDropdown(),this.buildReset(),this.buildSelectAll(),this.buildDropdownOptions(),this.buildFilter(),this.updateButtonText(),this.updateSelectAll(!0),this.options.enableClickableOptGroups&&this.options.multiple&&this.updateOptGroups(),this.options.wasDisabled=this.$select.prop("disabled"),this.options.disableIfEmpty&&t("option",this.$select).length<=0&&this.disable(),this.$select.wrap('<span class="multiselect-native-select" />').after(this.$container),"never"!==this.options.widthSynchronizationMode&&this.synchronizeButtonAndPopupWidth(),this.options.onInitialized(this.$select,this.$container)}void 0!==e&&e.bindingHandlers&&!e.bindingHandlers.multiselect&&(e.bindingHandlers.multiselect={after:["options","value","selectedOptions","enable","disable"],init:function(i,s,o,l,n){var p=t(i),a=e.toJS(s());if(p.multiselect(a),o.has("options")){var r=o.get("options");e.isObservable(r)&&e.computed({read:function(){r(),setTimeout((function(){var t=p.data("multiselect");t&&t.updateOriginalOptions(),p.multiselect("rebuild")}),1)},disposeWhenNodeIsRemoved:i})}if(o.has("value")){var c=o.get("value");e.isObservable(c)&&e.computed({read:function(){c(),setTimeout((function(){p.multiselect("refresh")}),1)},disposeWhenNodeIsRemoved:i}).extend({rateLimit:100,notifyWhenChangesStop:!0})}if(o.has("selectedOptions")){var h=o.get("selectedOptions");e.isObservable(h)&&e.computed({read:function(){h(),setTimeout((function(){p.multiselect("refresh")}),1)},disposeWhenNodeIsRemoved:i}).extend({rateLimit:100,notifyWhenChangesStop:!0})}var u=function(t){setTimeout((function(){t?p.multiselect("enable"):p.multiselect("disable")}))};if(o.has("enable")){var d=o.get("enable");e.isObservable(d)?e.computed({read:function(){u(d())},disposeWhenNodeIsRemoved:i}).extend({rateLimit:100,notifyWhenChangesStop:!0}):u(d)}if(o.has("disable")){var f=o.get("disable");e.isObservable(f)?e.computed({read:function(){u(!f())},disposeWhenNodeIsRemoved:i}).extend({rateLimit:100,notifyWhenChangesStop:!0}):u(!f)}e.utils.domNodeDisposal.addDisposeCallback(i,(function(){p.multiselect("destroy")}))},update:function(i,s,o,l,n){var p=t(i),a=e.toJS(s());p.multiselect("setOptions",a),p.multiselect("rebuild")}}),i.prototype={defaults:{buttonText:function(e,i){if(this.disabledText.length>0&&i.prop("disabled"))return this.disabledText;if(0===e.length)return this.nonSelectedText;if(this.allSelectedText&&e.length===t("option",t(i)).length&&1!==t("option",t(i)).length&&this.multiple)return this.selectAllNumber?this.allSelectedText+" ("+e.length+")":this.allSelectedText;if(0!=this.numberDisplayed&&e.length>this.numberDisplayed)return e.length+" "+this.nSelectedText;var s="",o=this.delimiterText;return e.each((function(){var e=void 0!==t(this).attr("label")?t(this).attr("label"):t(this).text();s+=e+o})),s.substr(0,s.length-this.delimiterText.length)},buttonTitle:function(e,i){if(0===e.length)return this.nonSelectedText;var s="",o=this.delimiterText;return e.each((function(){var e=void 0!==t(this).attr("label")?t(this).attr("label"):t(this).text();s+=e+o})),s.substr(0,s.length-this.delimiterText.length)},checkboxName:function(t){return!1},optionLabel:function(e){return t(e).attr("label")||t(e).text()},optionClass:function(e){return t(e).attr("class")||""},onChange:function(t,e){},onDropdownShow:function(t){},onDropdownHide:function(t){},onDropdownShown:function(t){},onDropdownHidden:function(t){},onSelectAll:function(){},onDeselectAll:function(){},onInitialized:function(t,e){},onFiltering:function(t){},enableHTML:!1,buttonClass:"custom-select",inheritClass:!1,buttonWidth:"auto",buttonContainer:'<div class="btn-group" />',dropRight:!1,dropUp:!1,selectedClass:"active",maxHeight:!1,includeSelectAllOption:!1,includeSelectAllIfMoreThan:0,selectAllText:" Select all",selectAllValue:"multiselect-all",selectAllName:!1,selectAllNumber:!0,selectAllJustVisible:!0,enableFiltering:!1,enableCaseInsensitiveFiltering:!1,enableFullValueFiltering:!1,enableClickableOptGroups:!1,enableCollapsibleOptGroups:!1,collapseOptGroupsByDefault:!1,filterPlaceholder:"Search",filterBehavior:"text",includeFilterClearBtn:!0,preventInputChangeEvent:!1,nonSelectedText:"None selected",nSelectedText:"selected",allSelectedText:"All selected",numberDisplayed:3,disableIfEmpty:!1,disabledText:"",delimiterText:", ",includeResetOption:!1,includeResetDivider:!1,resetText:"Reset",indentGroupOptions:!0,widthSynchronizationMode:"never",buttonTextAlignment:"center",templates:{button:'<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',popupContainer:'<div class="multiselect-container dropdown-menu"></div>',filter:'<div class="multiselect-filter d-flex align-items-center"><i class="fas fa-sm fa-search text-muted"></i><input type="search" class="multiselect-search form-control" /></div>',option:'<button type="button" class="multiselect-option dropdown-item"></button>',divider:'<div class="dropdown-divider"></div>',optionGroup:'<button type="button" class="multiselect-group dropdown-item"></button>',resetButton:'<div class="multiselect-reset text-center p-2"><button type="button" class="btn btn-sm btn-block btn-outline-secondary"></button></div>'}},constructor:i,buildContainer:function(){this.$container=t(this.options.buttonContainer),"never"!==this.options.widthSynchronizationMode?this.$container.on("show.bs.dropdown",t.proxy((function(){this.synchronizeButtonAndPopupWidth(),this.options.onDropdownShow()}),this)):this.$container.on("show.bs.dropdown",this.options.onDropdownShow),this.$container.on("hide.bs.dropdown",this.options.onDropdownHide),this.$container.on("shown.bs.dropdown",this.options.onDropdownShown),this.$container.on("hidden.bs.dropdown",this.options.onDropdownHidden)},buildButton:function(){if(this.$button=t(this.options.templates.button).addClass(this.options.buttonClass),this.$select.attr("class")&&this.options.inheritClass&&this.$button.addClass(this.$select.attr("class")),this.$select.prop("disabled")?this.disable():this.enable(),this.options.buttonWidth&&"auto"!==this.options.buttonWidth&&(this.$button.css({width:"100%"}),this.$container.css({width:this.options.buttonWidth})),this.options.buttonTextAlignment)switch(this.options.buttonTextAlignment){case"left":this.$button.addClass("text-left");break;case"center":this.$button.addClass("text-center");break;case"right":this.$button.addClass("text-right")}var e=this.$select.attr("tabindex");e&&this.$button.attr("tabindex",e),this.$container.prepend(this.$button)},buildDropdown:function(){this.$popupContainer=t(this.options.templates.popupContainer),this.options.dropRight?this.$container.addClass("dropright"):this.options.dropUp&&this.$container.addClass("dropup"),this.options.maxHeight&&this.$popupContainer.css({"max-height":this.options.maxHeight+"px","overflow-y":"auto","overflow-x":"hidden"}),"never"!==this.options.widthSynchronizationMode&&this.$popupContainer.css("overflow-x","hidden"),this.$popupContainer.on("touchstart click",(function(t){t.stopPropagation()})),this.$container.append(this.$popupContainer)},synchronizeButtonAndPopupWidth:function(){if(this.$popupContainer&&"never"!==this.options.widthSynchronizationMode){var t=this.$button.outerWidth();switch(this.options.widthSynchronizationMode){case"always":this.$popupContainer.css("min-width",t),this.$popupContainer.css("max-width",t);break;case"ifPopupIsSmaller":this.$popupContainer.css("min-width",t);break;case"ifPopupIsWider":this.$popupContainer.css("max-width",t)}}},buildDropdownOptions:function(){this.$select.children().each(t.proxy((function(e,i){var s=t(i),o=s.prop("tagName").toLowerCase();s.prop("value")!==this.options.selectAllValue&&("optgroup"===o?this.createOptgroup(i):"option"===o&&("divider"===s.data("role")?this.createDivider():this.createOptionValue(i,!1)))}),this)),t(this.$popupContainer).off("change",'> *:not(.multiselect-group) input[type="checkbox"], > *:not(.multiselect-group) input[type="radio"]'),t(this.$popupContainer).on("change",'> *:not(.multiselect-group) input[type="checkbox"], > *:not(.multiselect-group) input[type="radio"]',t.proxy((function(e){var i=t(e.target),s=i.prop("checked")||!1,o=i.val()===this.options.selectAllValue;this.options.selectedClass&&(s?i.closest(".multiselect-option").addClass(this.options.selectedClass):i.closest(".multiselect-option").removeClass(this.options.selectedClass));var l=i.val(),n=this.getOptionByValue(l),p=t("option",this.$select).not(n),a=t("input",this.$container).not(i);if(o?s?this.selectAll(this.options.selectAllJustVisible,!0):this.deselectAll(this.options.selectAllJustVisible,!0):(s?(n.prop("selected",!0),this.options.multiple?n.prop("selected",!0):(this.options.selectedClass&&t(a).closest(".dropdown-item").removeClass(this.options.selectedClass),t(a).prop("checked",!1),p.prop("selected",!1),this.$button.click()),"active"===this.options.selectedClass&&p.closest(".dropdown-item").css("outline","")):n.prop("selected",!1),this.options.onChange(n,s),this.updateSelectAll(),this.options.enableClickableOptGroups&&this.options.multiple&&this.updateOptGroups()),this.$select.change(),this.updateButtonText(),this.options.preventInputChangeEvent)return!1}),this)),t(".multiselect-option",this.$popupContainer).off("mousedown"),t(".multiselect-option",this.$popupContainer).on("mousedown",(function(t){if(t.shiftKey)return!1})),t(this.$popupContainer).off("touchstart click",".multiselect-option, .multiselect-all, .multiselect-group"),t(this.$popupContainer).on("touchstart click",".multiselect-option, .multiselect-all, .multiselect-group",t.proxy((function(e){e.stopPropagation();var i=t(e.target);if(e.shiftKey&&this.options.multiple){i.is("input")||(e.preventDefault(),(i=i.closest(".multiselect-option").find("input")).prop("checked",!i.prop("checked")));var s=i.prop("checked")||!1;if(null!==this.lastToggledInput&&this.lastToggledInput!==i){var o=this.$popupContainer.find(".multiselect-option:visible").index(i.closest(".multiselect-option")),l=this.$popupContainer.find(".multiselect-option:visible").index(this.lastToggledInput.closest(".multiselect-option"));if(o>l){var n=l;l=o,o=n}++l;var p=this.$popupContainer.find(".multiselect-option:not(.multiselect-filter-hidden)").slice(o,l).find("input");p.prop("checked",s),this.options.selectedClass&&p.closest(".multiselect-option").toggleClass(this.options.selectedClass,s);for(var a=0,r=p.length;a<r;a++){var c=t(p[a]);this.getOptionByValue(c.val()).prop("selected",s)}}i.trigger("change")}else if(!i.is("input")){if((c=i.closest(".multiselect-option, .multiselect-all").find(".form-check-input")).length>0)c.prop("checked",!c.prop("checked")),c.change();else if(this.options.enableClickableOptGroups&&this.options.multiple&&!i.hasClass("caret-container")){var h=i;h.hasClass("multiselect-group")||(h=i.closest(".multiselect-group")),(c=h.find(".form-check-input")).length>0&&(c.prop("checked",!c.prop("checked")),c.change())}e.preventDefault()}i.closest(".multiselect-option").find("input[type='checkbox'], input[type='radio']").length>0?this.lastToggledInput=i:this.lastToggledInput=null,i.blur()}),this)),this.$container.off("keydown.multiselect").on("keydown.multiselect",t.proxy((function(e){if(!t("input.multiselect-search",this.$container).is(":focus"))if(9===e.keyCode&&this.$container.hasClass("show"))this.$button.click();else{var i=t(this.$container).find(".multiselect-option:not(.disabled), .multiselect-group:not(.disabled), .multiselect-all").filter(":visible");if(!i.length)return;var s=i.index(i.filter(":focus")),o=i.eq(s);if(32===e.keyCode){var l=o.find("input");l.prop("checked",!l.prop("checked")),l.change(),e.preventDefault()}13===e.keyCode&&setTimeout((function(){o.focus()}),0)}}),this)),this.options.enableClickableOptGroups&&this.options.multiple&&(t(".multiselect-group input",this.$popupContainer).off("change"),t(".multiselect-group input",this.$popupContainer).on("change",t.proxy((function(e){e.stopPropagation();var i=t(e.target).prop("checked")||!1,s=t(e.target).closest(".dropdown-item"),o=s.nextUntil(".multiselect-group").not(".multiselect-filter-hidden").not(".disabled").find("input"),l=[];this.options.selectedClass&&(i?s.addClass(this.options.selectedClass):s.removeClass(this.options.selectedClass)),t.each(o,t.proxy((function(e,s){var o=t(s),n=o.val(),p=this.getOptionByValue(n);i?(o.prop("checked",!0),o.closest(".dropdown-item").addClass(this.options.selectedClass),p.prop("selected",!0)):(o.prop("checked",!1),o.closest(".dropdown-item").removeClass(this.options.selectedClass),p.prop("selected",!1)),l.push(this.getOptionByValue(n))}),this)),this.options.onChange(l,i),this.$select.change(),this.updateButtonText(),this.updateSelectAll()}),this))),this.options.enableCollapsibleOptGroups&&this.options.multiple&&(t(".multiselect-group .caret-container",this.$popupContainer).off("click"),t(".multiselect-group .caret-container",this.$popupContainer).on("click",t.proxy((function(e){var i=t(e.target).closest(".multiselect-group").nextUntil(".multiselect-group").not(".multiselect-filter-hidden"),s=!0;i.each((function(){s=s&&!t(this).hasClass("multiselect-collapsible-hidden")})),s?i.hide().addClass("multiselect-collapsible-hidden"):i.show().removeClass("multiselect-collapsible-hidden")}),this)))},createCheckbox:function(e,i,s,o,l,n){var p=t("<span />");if(p.addClass("form-check"),this.options.enableHTML&&t(i).length>0)p.append(t(i));else{var a=t('<label class="form-check-label" />');a.text(i),p.append(a)}var r=t('<input class="form-check-input"/>').attr("type",n);return r.val(o),p.prepend(r),s&&r.attr("name",s),e.prepend(p),e.attr("title",l||i),r},createOptionValue:function(e,i){var s=t(e);s.is(":selected")&&s.prop("selected",!0);var o=this.options.optionLabel(e),l=this.options.optionClass(e),n=s.val(),p=this.options.multiple?"checkbox":"radio",a=s.attr("title"),r=t(this.options.templates.option);r.addClass(l),i&&this.options.indentGroupOptions&&r.addClass("multiselect-group-option-indented"),this.options.collapseOptGroupsByDefault&&"optgroup"===t(e).parent().prop("tagName").toLowerCase()&&(r.addClass("multiselect-collapsible-hidden"),r.hide());var c=this.options.checkboxName(s),h=this.createCheckbox(r,o,c,n,a,p),u=s.prop("selected")||!1;n===this.options.selectAllValue&&(r.addClass("multiselect-all"),r.removeClass("multiselect-option"),h.parent().parent().addClass("multiselect-all")),this.$popupContainer.append(r),s.is(":disabled")&&h.attr("disabled","disabled").prop("disabled",!0).closest(".dropdown-item").addClass("disabled"),h.prop("checked",u),u&&this.options.selectedClass&&h.closest(".dropdown-item").addClass(this.options.selectedClass)},createDivider:function(e){var i=t(this.options.templates.divider);this.$popupContainer.append(i)},createOptgroup:function(e){var i=t(e),s=i.attr("label"),o=i.attr("value"),l=i.attr("title"),n=t("<span class='multiselect-group dropdown-item-text'></span>");if(this.options.enableClickableOptGroups&&this.options.multiple){n=t(this.options.templates.optionGroup);this.createCheckbox(n,s,null,o,l,"checkbox")}else this.options.enableHTML?n.html(" "+s):n.text(" "+s);var p=this.options.optionClass(e);n.addClass(p),this.options.enableCollapsibleOptGroups&&this.options.multiple&&(n.find(".form-check").addClass("d-inline-block"),n.append('<span class="caret-container dropdown-toggle pl-1"></span>')),i.is(":disabled")&&n.addClass("disabled"),this.$popupContainer.append(n),t("option",e).each(t.proxy((function(t,e){this.createOptionValue(e,!0)}),this))},buildReset:function(){if(this.options.includeResetOption){if(this.options.includeResetDivider){var e=t(this.options.templates.divider);e.addClass("mt-0"),this.$popupContainer.prepend(e)}var i=t(this.options.templates.resetButton);this.options.enableHTML?t("button",i).html(this.options.resetText):t("button",i).text(this.options.resetText),t("button",i).click(t.proxy((function(){this.clearSelection()}),this)),this.$popupContainer.prepend(i)}},buildSelectAll:function(){if("number"==typeof this.options.selectAllValue&&(this.options.selectAllValue=this.options.selectAllValue.toString()),!this.hasSelectAll()&&this.options.includeSelectAllOption&&this.options.multiple&&t("option",this.$select).length>this.options.includeSelectAllIfMoreThan){this.options.includeSelectAllDivider&&this.$popupContainer.prepend(t(this.options.templates.divider));var e=t(this.options.templates.li||this.options.templates.option),i=this.createCheckbox(e,this.options.selectAllText,this.options.selectAllName,this.options.selectAllValue,this.options.selectAllText,"checkbox");e.addClass("multiselect-all"),e.removeClass("multiselect-option"),e.find(".form-check-label").addClass("font-weight-bold"),this.$popupContainer.prepend(e),i.prop("checked",!1)}},buildFilter:function(){if(this.options.enableFiltering||this.options.enableCaseInsensitiveFiltering){var e=Math.max(this.options.enableFiltering,this.options.enableCaseInsensitiveFiltering);this.$select.find("option").length>=e&&(this.$filter=t(this.options.templates.filter),t("input",this.$filter).attr("placeholder",this.options.filterPlaceholder),this.options.includeFilterClearBtn?(this.isFirefox()&&0===this.$filter.find(".multiselect-clear-filter").length&&this.$filter.append("<i class='fas fa-times text-muted multiselect-clear-filter multiselect-moz-clear-filter'></i>"),this.$filter.find(".multiselect-clear-filter").on("click",t.proxy((function(e){clearTimeout(this.searchTimeout),this.query="",this.$filter.find(".multiselect-search").val(""),t(".dropdown-item",this.$popupContainer).show().removeClass("multiselect-filter-hidden"),this.updateSelectAll(),this.options.enableClickableOptGroups&&this.options.multiple&&this.updateOptGroups()}),this))):(this.$filter.find(".multiselect-search").attr("type","text"),this.$filter.find(".multiselect-clear-filter").remove()),this.$popupContainer.prepend(this.$filter),this.$filter.val(this.query).on("click",(function(t){t.stopPropagation()})).on("input keydown",t.proxy((function(e){13===e.which&&e.preventDefault(),this.isFirefox()&&this.options.includeFilterClearBtn&&(e.target.value?this.$filter.find(".multiselect-moz-clear-filter").show():this.$filter.find(".multiselect-moz-clear-filter").hide()),clearTimeout(this.searchTimeout),this.searchTimeout=this.asyncFunction(t.proxy((function(){var i,s;this.query!==e.target.value&&(this.query=e.target.value,t.each(t(".multiselect-option, .multiselect-group",this.$popupContainer),t.proxy((function(e,o){var l=t("input",o).length>0?t("input",o).val():"",n=t(".form-check-label",o).text(),p="";if("text"===this.options.filterBehavior?p=n:"value"===this.options.filterBehavior?p=l:"both"===this.options.filterBehavior&&(p=n+"\n"+l),l!==this.options.selectAllValue&&n){var a=!1;if(this.options.enableCaseInsensitiveFiltering&&(p=p.toLowerCase(),this.query=this.query.toLowerCase()),this.options.enableFullValueFiltering&&"both"!==this.options.filterBehavior){var r=p.trim().substring(0,this.query.length);this.query.indexOf(r)>-1&&(a=!0)}else p.indexOf(this.query)>-1&&(a=!0);a||(t(o).css("display","none"),t(o).addClass("multiselect-filter-hidden")),a&&(t(o).css("display","block"),t(o).removeClass("multiselect-filter-hidden")),t(o).hasClass("multiselect-group")?(i=o,s=a):(a&&t(i).show().removeClass("multiselect-filter-hidden"),!a&&s&&t(o).show().removeClass("multiselect-filter-hidden"))}}),this)));this.updateSelectAll(),this.options.enableClickableOptGroups&&this.options.multiple&&this.updateOptGroups(),this.options.onFiltering(e.target)}),this),300,this)}),this)))}},destroy:function(){this.$container.remove(),this.$select.show(),this.$select.prop("disabled",this.options.wasDisabled),this.$select.data("multiselect",null)},refresh:function(){var e={};t(".multiselect-option input",this.$popupContainer).each((function(){e[t(this).val()]=t(this)})),t("option",this.$select).each(t.proxy((function(i,s){var o=t(s),l=e[t(s).val()];o.is(":selected")?(l.prop("checked",!0),this.options.selectedClass&&l.closest(".multiselect-option").addClass(this.options.selectedClass)):(l.prop("checked",!1),this.options.selectedClass&&l.closest(".multiselect-option").removeClass(this.options.selectedClass)),o.is(":disabled")?l.attr("disabled","disabled").prop("disabled",!0).closest(".multiselect-option").addClass("disabled"):l.prop("disabled",!1).closest(".multiselect-option").removeClass("disabled")}),this)),this.updateButtonText(),this.updateSelectAll(),this.options.enableClickableOptGroups&&this.options.multiple&&this.updateOptGroups()},select:function(e,i){t.isArray(e)||(e=[e]);for(var s=0;s<e.length;s++){var o=e[s];if(null!=o){var l=this.getOptionByValue(o),n=this.getInputByValue(o);void 0!==l&&void 0!==n&&(this.options.multiple||this.deselectAll(!1),this.options.selectedClass&&n.closest(".dropdown-item").addClass(this.options.selectedClass),n.prop("checked",!0),l.prop("selected",!0),i&&this.options.onChange(l,!0))}}this.updateButtonText(),this.updateSelectAll(),this.options.enableClickableOptGroups&&this.options.multiple&&this.updateOptGroups()},clearSelection:function(){this.deselectAll(!1),this.updateButtonText(),this.updateSelectAll(),this.options.enableClickableOptGroups&&this.options.multiple&&this.updateOptGroups()},deselect:function(e,i){t.isArray(e)||(e=[e]);for(var s=0;s<e.length;s++){var o=e[s];if(null!=o){var l=this.getOptionByValue(o),n=this.getInputByValue(o);void 0!==l&&void 0!==n&&(this.options.selectedClass&&n.closest(".dropdown-item").removeClass(this.options.selectedClass),n.prop("checked",!1),l.prop("selected",!1),i&&this.options.onChange(l,!1))}}this.updateButtonText(),this.updateSelectAll(),this.options.enableClickableOptGroups&&this.options.multiple&&this.updateOptGroups()},selectAll:function(e,i){if(e=void 0===e||e){var s=t(".multiselect-option:not(.disabled):not(.multiselect-filter-hidden)",this.$popupContainer);t("input:enabled",s).prop("checked",!0),s.addClass(this.options.selectedClass),t("input:enabled",s).each(t.proxy((function(e,i){var s=t(i).val(),o=this.getOptionByValue(s);t(o).prop("selected",!0)}),this))}else{var o=t(".multiselect-option:not(.disabled)",this.$popupContainer);t("input:enabled",o).prop("checked",!0),o.addClass(this.options.selectedClass),t("input:enabled",o).each(t.proxy((function(e,i){var s=t(i).val(),o=this.getOptionByValue(s);t(o).prop("selected",!0)}),this))}t('.multiselect-option input[value="'+this.options.selectAllValue+'"]',this.$popupContainer).prop("checked",!0),this.options.enableClickableOptGroups&&this.options.multiple&&this.updateOptGroups(),this.updateButtonText(),this.updateSelectAll(),i&&this.options.onSelectAll()},deselectAll:function(e,i){if(e=void 0===e||e){var s=t(".multiselect-option:not(.disabled):not(.multiselect-filter-hidden)",this.$popupContainer);t('input[type="checkbox"]:enabled',s).prop("checked",!1),s.removeClass(this.options.selectedClass),t('input[type="checkbox"]:enabled',s).each(t.proxy((function(e,i){var s=t(i).val(),o=this.getOptionByValue(s);t(o).prop("selected",!1)}),this))}else{var o=t(".multiselect-option:not(.disabled):not(.multiselect-group)",this.$popupContainer);t('input[type="checkbox"]:enabled',o).prop("checked",!1),o.removeClass(this.options.selectedClass),t('input[type="checkbox"]:enabled',o).each(t.proxy((function(e,i){var s=t(i).val(),o=this.getOptionByValue(s);t(o).prop("selected",!1)}),this))}t('.multiselect-all input[value="'+this.options.selectAllValue+'"]',this.$popupContainer).prop("checked",!1),this.options.enableClickableOptGroups&&this.options.multiple&&this.updateOptGroups(),this.updateButtonText(),this.updateSelectAll(),i&&this.options.onDeselectAll()},rebuild:function(){this.$popupContainer.html(""),this.options.multiple="multiple"===this.$select.attr("multiple"),this.buildSelectAll(),this.buildDropdownOptions(),this.buildFilter(),this.updateButtonText(),this.updateSelectAll(!0),this.options.enableClickableOptGroups&&this.options.multiple&&this.updateOptGroups(),this.options.disableIfEmpty&&t("option",this.$select).length<=0?this.disable():this.enable(),this.options.dropRight?this.$container.addClass("dropright"):this.options.dropUp&&this.$container.addClass("dropup"),"never"!==this.options.widthSynchronizationMode&&this.synchronizeButtonAndPopupWidth()},dataprovider:function(e){var i=0,s=this.$select.empty();t.each(e,(function(e,o){var l;if(t.isArray(o.children))i++,l=t("<optgroup/>").attr({label:o.label||"Group "+i,disabled:!!o.disabled,value:o.value}),function(t,e){for(var i=0;i<t.length;++i)e(t[i],i)}(o.children,(function(e){var i={value:e.value,label:e.label||e.value,title:e.title,selected:!!e.selected,disabled:!!e.disabled};for(var s in e.attributes)i["data-"+s]=e.attributes[s];l.append(t("<option/>").attr(i))}));else{var n={value:o.value,label:o.label||o.value,title:o.title,class:o.class,selected:!!o.selected,disabled:!!o.disabled};for(var p in o.attributes)n["data-"+p]=o.attributes[p];(l=t("<option/>").attr(n)).text(o.label||o.value)}s.append(l)})),this.rebuild()},enable:function(){this.$select.prop("disabled",!1),this.$button.prop("disabled",!1).removeClass("disabled"),this.updateButtonText()},disable:function(){this.$select.prop("disabled",!0),this.$button.prop("disabled",!0).addClass("disabled"),this.updateButtonText()},setOptions:function(t){this.options=this.mergeOptions(t)},mergeOptions:function(e){return t.extend(!0,{},this.defaults,this.options,e)},hasSelectAll:function(){return t(".multiselect-all",this.$popupContainer).length>0},updateOptGroups:function(){var e=t(".multiselect-group",this.$popupContainer),i=this.options.selectedClass;e.each((function(){var e=t(this).nextUntil(".multiselect-group").not(".multiselect-filter-hidden").not(".disabled"),s=!0;e.each((function(){t("input",this).prop("checked")||(s=!1)})),i&&(s?t(this).addClass(i):t(this).removeClass(i)),t("input",this).prop("checked",s)}))},updateSelectAll:function(e){if(this.hasSelectAll()){var i=t(".multiselect-option:not(.multiselect-filter-hidden):not(.multiselect-group):not(.disabled) input:enabled",this.$popupContainer),s=i.length,o=i.filter(":checked").length,l=t(".multiselect-all",this.$popupContainer),n=l.find("input");o>0&&o===s?(n.prop("checked",!0),l.addClass(this.options.selectedClass)):(n.prop("checked",!1),l.removeClass(this.options.selectedClass))}},updateButtonText:function(){var e=this.getSelected();this.options.enableHTML?t(".multiselect .multiselect-selected-text",this.$container).html(this.options.buttonText(e,this.$select)):t(".multiselect .multiselect-selected-text",this.$container).text(this.options.buttonText(e,this.$select)),t(".multiselect",this.$container).attr("title",this.options.buttonTitle(e,this.$select)),this.$button.trigger("change")},getSelected:function(){return t("option",this.$select).filter(":selected")},getOptionByValue:function(e){for(var i=t("option",this.$select),s=e.toString(),o=0;o<i.length;o+=1){var l=i[o];if(l.value===s)return t(l)}},getInputByValue:function(e){for(var i=t(".multiselect-option input:not(.multiselect-search)",this.$popupContainer),s=e.toString(),o=0;o<i.length;o+=1){var l=i[o];if(l.value===s)return t(l)}},updateOriginalOptions:function(){this.originalOptions=this.$select.clone()[0].options},asyncFunction:function(t,e,i){var s=Array.prototype.slice.call(arguments,3);return setTimeout((function(){t.apply(i||window,s)}),e)},setAllSelectedText:function(t){this.options.allSelectedText=t,this.updateButtonText()},isFirefox:function(){return!(!navigator||!navigator.userAgent)&&navigator.userAgent.toLocaleLowerCase().indexOf("firefox")>-1}},t.fn.multiselect=function(e,s,o){return this.each((function(){var l=t(this).data("multiselect");l||(l=new i(this,"object"==typeof e&&e),t(this).data("multiselect",l)),"string"==typeof e&&(l[e](s,o),"destroy"===e&&t(this).data("multiselect",!1))}))},t.fn.multiselect.Constructor=i,t((function(){t("select[data-role=multiselect]").multiselect()}))}));
