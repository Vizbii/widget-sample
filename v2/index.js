(function(window, document, undefined) {
  'use strict';

  // Define the widget collection.
  var collection = null;

  // Documentation: https://docs.morphii.com/widget_documentation_2_0.html
  // Define the morphii ids that will be used in the widgets.
  // Publicly available: https://docs.morphii.com/morphii_list.html
  var morphiiIds = [
    { id: '6387684990323101696' },
    { id: '6387687516724666368' },
    { id: '6387687738608865280' },
    { id: '6387686352809422848' },
    { id: '6387687144609767424' },
    { id: '6387687069345202176' },
    { id: '6387687641635434496' }
  ];

  // Setup the widget when the page is ready.
  window.onload = function() {
    createWidget();

    // Add change event to language selection.
    var langSelection = document.getElementById('language-selection');
    if (langSelection) {
      langSelection.addEventListener('change', langSelectionChange);
    }

    // Call submit function when Submitt button is clicked.
    var submitButton = document.getElementById('submit-button');
    if (submitButton) {
      submitButton.addEventListener('click', submit);

      // Disable submit button util a morphii is selected.
      submitButton.setAttribute('disabled', 'disabled');
    }
  }

  function langSelectionChange(event) {
    if (collection) {
      var lang = document.getElementById('language-selection').value;
      collection.language(lang);
    }
  }

  // Define the widget options.
  function widgetOptions(qId) {
    return {
      div_id: 'widget-' + qId,
      morphii: {
        ids: morphiiIds,
        show_name: true,  // Set to `false` to not display morphii names.
        wrap_name: true
      },
      target : {
        id: qId,
        type : 'question'
      },
      comment: {
        show: false,   // Set to `true` to see comment field.
        required: false
      },
      slider: {
        initial_intensity: 0.2,
        show_animation: true
      },
      selection: {
        required: true  // Set to `false` to not require selection.
      },
      options: {
        stage: 'test'
      }
    };
  }

  function createWidget() {
    var collectionOptions = {
      client_key: '349ec763-474f-4084-9dcd-b373ddb778cd',
      account_id: '17253015',
      project: {
        id: 'widget-sample',
        description: 'Sample widget code.'
      },
      application: {
        name: 'sample-application',
        description: 'Sample demo of Widget v2.',
        version: '1.0'
      },
      user: {
        id: 'user-id'
      },
      callbacks: {
        error: errorCallback,
        selection_change: selectionChangeCallback
      }
    };

    collection = new MorphiiWidgets.Collection();
    collection.init(collectionOptions, function(error, valid) {
      if (valid === true) {
        // Add the widget to each question on the page.
        ['q1', 'q2'].forEach(function(qId) {
          var option = widgetOptions(qId);
          collection.add(option, function(error, results) {
            if (error) {
              console.log('Collection add error: ' + JSON.stringify(error, null, 2));
            }
            else {
              var divId = results.configuration.div_id;
              var targetId = results.configuration.target.id;

              // The target id (in the widget options) was set as the element id
              // for the question text.
              var questionText = document.getElementById(targetId).textContent;

              // Add additional metadata to widget.
              collection.addMetadata(divId, 'question_id', targetId);
              collection.addMetadata(divId, 'question', questionText);

              collection.addMetadata(divId, 'foo1', 'bar1');
              collection.addMetadata(divId, 'foo2', 'bar2');
              collection.addMetadata(divId, 'foo3', 'bar3');
            }
          });
        });
      }
      else {
        console.log('Init error: ' + JSON.stringify(error, null, 2));
      }
    });
  }

  // The Collection widget error callback
  function errorCallback(error) {
    console.log('Error callback: ' + JSON.stringify(error, null, 2));
  }

  // Selection Change callback
  function selectionChangeCallback(event) {
    console.log('Selection Change callback: ' + JSON.stringify(event, null, 2));
    // Enable/disable the Submit button based on if a morphii is selected.
    // If you do not want this behavior then set the selection->required to
    // false in the widget options above.
    // If selection required is set to false then this callback is not needed.
    var submitButton = document.getElementById('submit-button');
    if (submitButton) {
      if (event.selection_required_valid === true) {
        submitButton.removeAttribute('disabled');
      }
      else {
        submitButton.setAttribute('disabled', 'disabled');
      }
    }
  }

  // Submit the data for the collection.
  function submit(event) {
    if (collection) {
      // Submit all the widget in the collection at once.
      collection.submit(function(error, results) {
        if (error) {
          console.log('Submit results (error): ' + JSON.stringify(error, null, 2));
        }
        else {
          // To view the results, iterator over each record.
          var length = results.length;
          for (var i = 0; i < length; i++) {
            var record = results[i];
            if (record && record.submitted === true) {
              console.log('Submit record: ' + JSON.stringify(record, null, 2));

              // You have access to all the data submitted at this point. For example,
              // you may want the morphii Id, name, intensity, and comment to store
              // in your database.
              // You can pull other information from the results if you like (i.e. referer, user agent, etc...)
              console.log('Results for target id: ' + record.target_id);
              console.log('reaction id: ' + record.reaction_id);
              if (record.reaction_record) {
                console.log('morphii id: ' + record.reaction_record.morphii.id);
                console.log('morphii part name: ' + record.reaction_record.morphii.part_name);
                console.log('morphii display name: ' + record.reaction_record.morphii.display_name);
                console.log('morphii intensity: ' + record.reaction_record.morphii.intensity);
                if (record.reaction_record.comment) {
                  console.log('comment locale: ' + record.reaction_record.comment.locale);
                  console.log('comment text: ' + record.reaction_record.comment.text);
                }
                else {
                  console.log('No comment provided');
                }
              }
              else {
                console.log('Subscription for this account has expired or reached the reaction limit.');
              }
            }
            else {
              console.log('Morphii data not submitted.');
              console.log('Submit results: ' + JSON.stringify(record, null, 2));
            }
          }
        }
      });
    }
  }
})(window, document);
