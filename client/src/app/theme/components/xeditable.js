angular.module('xeditable').directive('editableSelect2', ['editableDirectiveFactory',
    function (editableDirectiveFactory) {
        return editableDirectiveFactory({
            directiveName: 'editableSelect2',
            inputTpl:      '<ui-select theme="bootstrap"></ui-select>',
            render:        function () {
                this.parent.render.call(this);
                
                var choices = this.attrs.eSelectChoices,
                    placeholder = this.attrs.ePlaceholder,
                    viewFieldName = this.attrs.eViewField,
                    model = this.attrs.editableSelect2;
                    
                var html =
                    '<ui-select-match placeholder="' + placeholder + '">{{ $select.selected[\'' + viewFieldName +  '\'] + \', \' + $select.selected[\'last_name\'] }}</ui-select-match>' +
                    '<ui-select-choices class="myselect" repeat="' + choices + '">' +
                    '<div ng-bind-html="(item.first_name + \', \' +  item.last_name + \' (\' + item.email + \')\') | highlight: $select.search">item.' + viewFieldName + '</div>' +
                    '</ui-select-choices>';

                this.inputEl.attr('ng-model', model);
                this.inputEl.html(html);
            }
        });
    }]);