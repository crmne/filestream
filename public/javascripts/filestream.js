function renderUpload (upload, id) {
  var elem = $('.upload#' + id)
  if (elem.length == 0) { // create a new upload node if doesn't exist
    elem = $('.upload.template').clone().removeClass('template').attr('id', id);
  }
  if (upload.link && upload.file) {
    var link = $('<a />').prop('href', upload.link).text(upload.file.name);
    elem.find('.title').html(link);
    elem.find('.created_at').text("Uploaded: " + upload.file.lastModifiedDate);
    elem.find('.size').text("Size: " + upload.file.size / 1024 + " KB");
    elem.find('.path').text("Path: " + upload.file.path);
  }
  if (upload.comment) {
    elem.find('.comment').text(upload.comment);
  }
  return elem;
}

function updateUploadStatus (id, requireComments) {
  $.getJSON('/upload/' + id + '/status', function (data) {
    if (requireComments && !data.comment) {
      updateUploadStatus(id, requireComments); // retry
    } else {
      if (requireComments) {
        $('form#comment textarea').val('');
      }
      renderUpload(data, id).prependTo('#uploads').effect('highlight', {}, 1000);
    }
  });
}

$(document).ready(function () {
  var uuid = new String;

  // retrieve and render upload list
  $.getJSON('/uploads.json', function(data) {
    if (!jQuery.isEmptyObject(data)) {
      $('h3#uploads_title').text('Uploads:');
      $.each(data, function(k,v) {
        renderUpload(v,k).prependTo('#uploads');
      });
    }
  });
  
  $('form#upload').submit(function(){
    // starting upload
    uuid = UUID.generate();

    // update form actions
    $('form#upload').attr('action', '/upload/' + uuid);
    $('form#comment').attr('action', '/upload/' + uuid + '/comment');

    // UI changes
    $('form#upload input[type=submit]').attr('disabled', true).attr('value', 'Uploading...');
    $('#progressbar').progressbar({value: 0, disabled: false}).fadeIn('slow');
    $('#comment').fadeIn('slow');

    // update upload status
    $.PeriodicalUpdater('/upload/' + uuid + '/status', {
      method: 'get',
      minTimeout: 300,
      maxTimeout: 2000,
      autoStop: 10
    }, function (data, success, xhr, handle) {
      // upload status updated
      var json = jQuery.parseJSON(data);
      $('#progressbar').progressbar({value: json.percent});

      if (json.file) {
        // upload finished
        handle.stop();
        // UI changes
        $('#progressbar').progressbar({disabled: true}).hide();
        $('form#upload input[type=submit]').attr('disabled', false).attr('value', 'Upload');
        $('h3#uploads_title').text('Uploads:');
        updateUploadStatus(uuid, false);
      }
    });
  });

  $('form#comment').submit(function(){
    $('form#comment').fadeOut('slow');
    updateUploadStatus(uuid, true);
  });
});
