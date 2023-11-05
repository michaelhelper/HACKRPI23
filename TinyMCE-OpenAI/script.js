           tinymce.init({
                selector: '#editor',
                plugins: 'ai advtable powerpaste casechange searchreplace autolink advcode image link codesample table  tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker',
                toolbar: 'undo redo print spellcheckdialog formatpainter | bold italic underline forecolor backcolor | link | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist | removeformat | aidialog aishortcuts',
                height: '700px',
                ai_shortcuts: [
                     { title: 'Screenplay', prompt: 'Convert this to screenplay format.' },
                     { title: 'Stage play', prompt: 'Convert this to stage play format.' },
                     { title: 'Radio play', prompt: 'Convert this to radio play format.' },
                     { title: 'Classical', subprompts:
                        [
                          { title: 'Dialogue', prompt: 'Convert this to a Socratic dialogue.' },
                          { title: 'Homeric', prompt: 'Convert this to a Classical Epic.' },
                        ]
                      }
                   ],