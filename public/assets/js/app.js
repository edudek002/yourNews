$(document).ready(function(){

  $(document).on("click", ".message-added", showMessage);
  $(document).on("click", "#add-message", addMessage);
  $(".position").hover(read, unread);
  //$(".position").hover(unread, read);
  $("#close-note").on("click", function() {
  $("#addnote").fadeOut(300);
  });

  function read() {
    var position = $(this).attr("value");
    if (position === "Saved") {
      $(this).html("Unsave");
    }
  };

  function unread() {
    $(this).html($(this).attr("value"));
  }

  function showMessage(event) {
    event.preventDefault();
    var id = $(this).attr("value");
    $("#addMessage").fadeIn(300).css("display", "flex");
    $("#add-message").attr("value", id);
    $.get("/" + id, function(data) {
      $("#article-title").text(data.title);
      $.get("/note/" + id, function(data) {
        if (data) {
          $("#note-title").val(data.title);
          $("#note-body").val(data.body);
        }
      });
    });
  } 

  function addMessage(event) {
    event.preventDefault();
    var id = $(this).attr("value");
    var obj = {
      title: $("#note-title").val().trim(),
      body: $("#note-body").val().trim()
    };
    $.post("/note/" + id, obj, function(data) {
      window.location.href = "/saved";
    });
  }
});
  