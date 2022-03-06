function showTutorial(){
  $("#pop-up-content").empty();
  $("#pop-up-title").html("<i class='fa-solid fa-note-sticky'></i> Tutorial");
  
  //Create tutorial box
  let element = ` <div class="pop-up-tutorial-box accent-color-0">
                    <div id="pop-up-tutorial-page"></div>
                    <div class="tutorial-button-group">
                      <button class="tutorial-button accent-color-1" id="tutorial-button_back" disabled>Back</button>
                      <button class="tutorial-button accent-color-1" id="tutorial-button_next">Next</button>
                    </div>
                  </div>`;
  $("#pop-up-content").append(element);
  $("#pop-up-section").show();

  let currentPage = 1;

  let page = [];
  page[1] = `
            <div class="tutorial-image-text-group">
              <img src="img/tutorial/johntutorial.jpg" draggable="false" class="tutorial-img tutorial-man-img"/>
              <div class="tutorial-group-text">
                <p class="tutorial-text">Hello there entrepreneur!</p>
                <p class="tutorial-text">Are you ready to join the Business Club?</p>
              </div>
            </div>
            <p class="tutorial-text">Of course you are!</p>
            <p class="tutorial-text">If you know the basics, close the tutorial with the X button and go make some money.</p>
            <p class="tutorial-text">If you don't know how to get started, then press Next and I'll show you around.</p>
            `
  page[2] = `
            <div class="tutorial-image-text-group">
              <img src="img/tutorial/tutorial_2_1.jpg" draggable="false" class="tutorial-img tutorial-small-img"/>
              <div class="tutorial-group-text">
                <p class="tutorial-text">This is a business!</p>
              </div>
            </div>
            <p class="tutorial-text">You can buy multiple instances of a business to increase production, but it will keep getting more and more expensive.</p>
            <p class="tutorial-text">Your business will start manufacturing when you click on its image. When you get tired of clicking (and you're also rich enough) you can hire a manager to automate the manufacturing process for your businesses.</p>
            `
  page[3] = `
            <img src="img/tutorial/tutorial_3_1.jpg" draggable="false" class="tutorial-img tutorial-big-img"/>
            <p class="tutorial-text">A series of businesses make a production chain.</p>
            <p class="tutorial-text">Setting up a production chain and selling the final output through a business (marked with $ sign in the name) can get you huge passive income.</p>
            `
  page[4] = `
            <img src="img/tutorial/tutorial_4_1.jpg" draggable="false" class="tutorial-img tutorial-small-img"/>
            <hr>
            <p class="tutorial-text">If you reach a milestone you will be rewarded with a bonus.</p>
            <p class="tutorial-text">Also look out for upgrades that you can purchase to increase your production.</p>
            <p class="tutorial-text">And make sure to sell the extra products that you have just laying around!</p>
            `
  page[5] = `
            <img src="img/tutorial/tutorial_5_1.png" draggable="false" class="tutorial-img tutorial-big-img"/>
            <hr>
            <p class="tutorial-text">Alright! Time for me to go.</p>
            <p class="tutorial-text">See you on the leaderboards!</p>
            `

  let setPage = () => {
    $("#pop-up-tutorial-page").empty()
    $("#pop-up-tutorial-page").html(page[currentPage]);

    //Enable the back button when not on first page
    if(currentPage != 1){ $("#tutorial-button_back").prop("disabled",false); }
    else{ $("#tutorial-button_back").prop("disabled",true); }

    //Change Next button to Finish on last page
    if(currentPage == page.length-1){ $("#tutorial-button_next").html("Finish"); }
    else{ $("#tutorial-button_next").html("Next"); }
  }
  setPage();

  //Tutorial Button Click Event
  $("#tutorial-button_next").click(() => {
    currentPage += 1;
    setPage();
    //Close tutorial on last page
    if(currentPage == page.length){
      $("#pop-up-section").hide();
    }
  });

  $("#tutorial-button_back").click(() => {
    currentPage -= 1;
    setPage();
  });
}