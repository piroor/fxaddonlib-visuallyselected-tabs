/*
 Backporting "visuallyselected" for Firefox 40 and older versions

 See also:
   http://www.hackermusings.com/2015/06/electrolysis-a-tale-of-tab-switching-and-themes/

 Usage:
   Components.utils.import(".../path/to/visuallyselectedTabs.jsm");
   visuallyselectedTabs(gBrowser);

 license: The MIT License, Copyright (c) 2015 YUKI "Piro" Hiroshi
 original:
   http://github.com/piroor/fxaddonlib-visuallyselected-tabs
*/

var EXPORTED_SYMBOLS = ['visuallyselectedTabs'];

Components.utils.import('resource://gre/modules/Services.jsm');

function visuallyselectedTabs(aTabBrowser) {
  if (!aTabBrowser ||
      aTabBrowser.localName != 'tabbrowser' ||
      aTabBrowser.__visuallyselectedTabsInstalled ||
      Services.vc.compare(Services.appinfo.platformVersion, '41.0a1') >= 0)
    return;

  aTabBrowser.__visuallyselectedTabsInstalled = true;

  function onTabSelect(aEvent) {
    var prevTab = aEvent.detail && aEvent.detail.previousTab;
    if (prevTab)
      prevTab.removeAttribute('visuallyselected');

    aEvent.originalTarget.setAttribute('visuallyselected', true);
  }

  var tabsContainer = aTabBrowser.tabContainer;
  tabsContainer.addEventListener('TabSelect', onTabSelect, false);

  var document = aTabBrowser.ownerDocument;
  document.addEventListener('unload', function onUnload(aEvent) {
    document.removeEventListener('unload', onUnload, false);
    tabsContainer.removeEventListener('TabSelect', onTabSelect, false);
  }, false);
}
