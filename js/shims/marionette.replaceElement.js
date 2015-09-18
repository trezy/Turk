Marionette = require( 'backbone.marionette' );





Marionette.Region.prototype.show = function (view, options) {
  var showOptions, isDifferentView, preventDestroy, forceShow, replaceElement, isChangingView, _shouldDestroyView, _shouldShowView, _shouldReplaceElement;

  this._ensureElement()

  showOptions = options || {};
  isDifferentView = view !== this.currentView;
  preventDestroy = !!showOptions.preventDestroy;
  forceShow = !!showOptions.forceShow;
  replaceElement = !!showOptions.replaceElement;

  isChangingView = !!this.currentView;
  _shouldDestroyView = isDifferentView && ! preventDestroy;
  _shouldShowView = isDifferentView || forceShow;
  _shouldReplaceElement = replaceElement;

  if ( isChangingView ) {
    this.triggerMethod( 'before:swapOut', this.currentView );
  }

  if ( _shouldDestroyView ) {
    this.empty();
  } else if ( isChangingView && _shouldShowView ) {
    this.currentView.off( 'destroy', this.empty, this );
  }

  if ( _shouldShowView ) {
    view.once( 'destroy', this.empty, this );
    view.render();

    if ( isChangingView ) {
      this.triggerMethod( 'before:swap', view, this, options );
    }

    this.triggerMethod( 'before:show', view, this, options );
    Marionette.triggerMethodOn( view, 'before:show', this, options );

    this.attachHtml( view, _shouldReplaceElement );

    if ( isChangingView ) {
      this.triggerMethod( 'swapOut', this.currentView, this, options );
    }

    this.currentView = view;

    if ( isChangingView ) {
      this.triggerMethod( 'swap', view, this, options );
    }

    this.triggerMethod( 'show', view, this, options );
    Marionette.triggerMethodOn( view, 'show', view, this, options );

    return this;
  }

  return this;
}

Marionette.Region.prototype.replaceEl = function ( view ) {
  var parent;

  parent = this.el.parentNode;
  parent.replaceChild( view.el, this.el );
  this.replaced = true;
}

Marionette.Region.prototype.restoreEl = function () {
  var parent, view;

  view = this.currentView;
  parent = view.el.parentNode;
  parent.replaceChild( this.el, view.el );
  this.replaced = false;
}

Marionette.Region.prototype.attachHtml = function (view) {
  if ( arguments[1] ) {
    this.replaceEl( view );
  } else {
    this.el.innerHTML = '';
    this.el.appendChild( view.el );
  }
}

Marionette.Region.prototype.empty = function () {
  var view;

  view = this.currentView;

  if ( !view ) {
    return;
  }

  this.triggerMethod( 'before:empty', view );

  if ( this.replaced ) {
    this.restoreEl();
  }

  this._destroyView();
  this.triggerMethod( 'empty', view );

  delete this.currentView;
  return this;
}
