import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js'; 
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if(module.hot){
//   module.hot.accept();
// }

const controlRecipe = async function(){
  try{
    // Get recipe id from the hash array
    const id = window.location.hash.slice(1);

    // If id doesn't exist stop the process
    if(!id) return;

    // Render the loading spinner icon
    recipeView.renderSpinner();

    //Update results view to mark selected search result
    resultsView.update(model.getSearchPageResults());
    bookmarksView.update(model.state.bookmarks);   

    // Wait for the model to load the recipe
    await model.loadRecipe(id);

    // Render the recipe from the View
    recipeView.render(model.state.recipe);
  } 
  catch (err){
      recipeView.renderError();
  }
};

const constrolSearchResults = async function(){
  try{
    // Render Spinner
    resultsView.renderSpinner();

    // Get search query from SearchView
    const query = searchView.getQuery();

    // If query doesn't exist stop the process
    if(!query) return;

    // wait for model to load the search results
    await model.loadSearchResults(query);

    // Render results of search to the DOM
    resultsView.render(model.getSearchPageResults());
    paginationView.render(model.state.search);
  }
  catch(err){
  }
}

const controlPagination = function(goToPage){
  //Render new results
  resultsView.render(model.getSearchPageResults(goToPage));

  //Render NEW pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  //Update recipe servings
  model.updateServings(newServings);

  //Render updated serving sizes in the servings view
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  //If recipe is not bookmarked set bookmarked to true otherwise set it to false
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);  
  
  // Update the recipeView
  recipeView.update(model.state.recipe);

  //Render the bookmarksView
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
    //Render loading spinner
    addRecipeView.renderSpinner(); 

    //Upload new recipe data
    await model.uploadRecipe(newRecipe);

    //Render new recipe 
    recipeView.render(model.state.recipe);
    
    //Display Success message
    bookmarksView.render(model.state.bookmarks);
    
    addRecipeView.renderMessage();
    
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
     
    //Close modal window
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000); 

  }catch(err){
    console.error('!!!', err);
    addRecipeView.renderError(err.message);
  }
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  // Subscribe to the RecipeView EventHandlers
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark); 
  
  //sSubscribe to the AddRecipeView EventHandlers
  addRecipeView.addHandlerUpload(controlAddRecipe);

  //Subscribe to the SearchView EventHandlers
  searchView.addHandlerSearch(constrolSearchResults);

  //Subscribe to the PaginationView EventHandlers
  paginationView.addHandlerClick(controlPagination);

}
init();

// performs same commands as the lines underneathe
// addEventListener('hashchange', showRecipe);
// addEventListener('load', showRecipe);