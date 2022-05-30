<?php

namespace Igniter\Admin\FormWidgets;

use Igniter\Admin\Classes\BaseFormWidget;
use Igniter\Flame\Mail\Markdown;

/**
 * Code Editor
 * Renders a code editor field.
 */
class MarkdownEditor extends BaseFormWidget
{
    //
    // Configurable properties
    //

    /**
     * @var string Display mode: split, tab.
     */
    public $mode = 'tab';

    //
    // Object properties
    //

    protected $defaultAlias = 'markdown';

    public function initialize()
    {
        $this->fillFromConfig([
            'mode',
        ]);

        if ($this->formField->disabled || $this->formField->readOnly) {
            $this->previewMode = true;
        }
    }

    public function render()
    {
        $this->prepareVars();

        return $this->makePartial('markdowneditor/markdowneditor');
    }

    /**
     * Prepares the widget data
     */
    public function prepareVars()
    {
        $this->vars['mode'] = $this->mode;
        $this->vars['stretch'] = $this->formField->stretch;
        $this->vars['size'] = $this->formField->size;
        $this->vars['name'] = $this->formField->getName();
        $this->vars['value'] = $this->getLoadValue();
    }

    public function loadAssets()
    {
        $this->addJs('js/vendor.editor.js', 'vendor-editor-js');
        $this->addCss('igniter::formwidgets.markdowneditor', 'markdowneditor-css');
        $this->addJs('markdowneditor.js', 'markdowneditor-js');
    }

    public function onRefresh()
    {
        $value = post($this->formField->getName());
        $previewHtml = Markdown::parse($value)->toHtml();

        return [
            'preview' => $previewHtml,
        ];
    }
}
