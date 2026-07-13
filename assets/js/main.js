// AdvanceStore main.js — Neoncart Electronic theme
var WA_NUM="447367062256";

// Mobile drawer
var asOverlay=document.querySelector('.as_overlay');
var asDrawer=document.querySelector('.as_drawer');
var asHam=document.querySelector('.as_hamburger');
var asDrawerClose=document.querySelector('.as_drawer_close');
function openDrawer(){asDrawer&&asDrawer.classList.add('open');asOverlay&&asOverlay.classList.add('open');document.body.style.overflow='hidden';}
function closeDrawer(){asDrawer&&asDrawer.classList.remove('open');asOverlay&&asOverlay.classList.remove('open');document.body.style.overflow='';}
if(asHam)asHam.addEventListener('click',openDrawer);
if(asOverlay)asOverlay.addEventListener('click',closeDrawer);
if(asDrawerClose)asDrawerClose.addEventListener('click',closeDrawer);

// Sticky header scroll shadow
var asHeader=document.querySelector('.as_header_main');
if(asHeader)window.addEventListener('scroll',function(){asHeader.style.boxShadow=window.scrollY>60?'0 4px 16px rgba(0,0,0,.1)':'0 2px 8px rgba(0,0,0,.06)';},{passive:true});

// Global WA float button
var asWaFloat=document.querySelector('.as_wa_float');
if(asWaFloat){
  asWaFloat.addEventListener('click',function(e){
    e.preventDefault();
    var msg=encodeURIComponent("Hi, I'd like to enquire about your products at advancestore.co.uk");
    window.open("https://wa.me/"+WA_NUM+"?text="+msg,"_blank");
  });
}

// Search modal
var asSearchModal=document.querySelector('.as_search_modal');
var asSearchInput=document.querySelector('.as_search_modal_input');
var asSearchResults=document.querySelector('.as_search_results');
var asSearchClose=document.querySelector('.as_search_modal_close');
document.querySelectorAll('.open-search,[data-open-search]').forEach(function(b){
  b.addEventListener('click',function(){
    if(asSearchModal){asSearchModal.classList.add('open');asSearchInput&&asSearchInput.focus();}
  });
});
// Also open on header search input click
var asHeaderInput=document.getElementById('as_search_input');
if(asHeaderInput)asHeaderInput.addEventListener('focus',function(){
  if(asSearchModal){asSearchModal.classList.add('open');asSearchInput&&asSearchInput.focus();}
});
if(asSearchClose)asSearchClose.addEventListener('click',function(){asSearchModal&&asSearchModal.classList.remove('open');});
if(asSearchModal)asSearchModal.addEventListener('click',function(e){if(e.target===asSearchModal)asSearchModal.classList.remove('open');});
if(asSearchInput){
  asSearchInput.addEventListener('input',function(){
    var q=asSearchInput.value.trim().toLowerCase();
    if(!asSearchResults||!window.PRODUCT_INDEX)return;
    if(!q){asSearchResults.innerHTML='';return;}
    var hits=window.PRODUCT_INDEX.filter(function(p){return p.n.toLowerCase().indexOf(q)>=0||p.b.toLowerCase().indexOf(q)>=0;}).slice(0,8);
    asSearchResults.innerHTML=hits.map(function(p){return'<li><a href="/product/'+p.s+'"><span>'+p.b+'</span> '+p.n+'</a></li>';}).join('');
  });
}

// Brand filter on category pages
var asBrandFilters=document.querySelectorAll('[data-brand-filter]');
asBrandFilters.forEach(function(cb){cb.addEventListener('change',function(){asApplyFilters();});});
function asApplyFilters(){
  var checked=Array.from(asBrandFilters).filter(function(cb){return cb.checked;}).map(function(cb){return cb.dataset.brandFilter;});
  document.querySelectorAll('.as_product_card').forEach(function(card){
    var show=checked.length===0||checked.indexOf(card.dataset.brand)>=0;
    card.parentElement.style.display=show?'':'none';
  });
}

// Brand chip - navigate to brand page (no filter, chips are links)
document.querySelectorAll('.as_brand_chip[data-filter]').forEach(function(chip){
  chip.addEventListener('click',function(e){
    // Allow normal link navigation - do not preventDefault
    // chip.classList.toggle('active');  // removed - navigate instead
    var active=Array.from(document.querySelectorAll('.as_brand_chip.active')).map(function(c){return c.dataset.filter;});
    document.querySelectorAll('.as_product_card').forEach(function(card){
      var show=active.length===0||active.indexOf(card.dataset.brand)>=0;
      card.parentElement.style.display=show?'':'none';
    });
  });
});

// Sort
var asSortSel=document.querySelector('.as_sort_select');
if(asSortSel){
  asSortSel.addEventListener('change',function(){
    var grid=document.querySelector('.as_shop_grid,.as_products_grid');
    if(!grid)return;
    var items=Array.from(grid.children);
    items.sort(function(a,b){
      var na=a.querySelector('.as_product_name')&&a.querySelector('.as_product_name').textContent||'';
      var nb=b.querySelector('.as_product_name')&&b.querySelector('.as_product_name').textContent||'';
      return asSortSel.value==='az'?na.localeCompare(nb):nb.localeCompare(na);
    });
    items.forEach(function(i){grid.appendChild(i);});
  });
}

// Product page tabs
document.querySelectorAll('.as_pd_tab').forEach(function(tab){
  tab.addEventListener('click',function(){
    document.querySelectorAll('.as_pd_tab,.as_pd_tab_content').forEach(function(el){el.classList.remove('active');});
    tab.classList.add('active');
    var t=document.getElementById(tab.dataset.tab);
    if(t)t.classList.add('active');
  });
});

// Back to top
window.addEventListener('scroll',function(){
  var btn=document.querySelector('.as_back_top');
  if(btn)btn.style.display=window.scrollY>400?'flex':'none';
},{passive:true});

// ── Hero slider (Slick) ──────────────────────────────────────────────────
if(typeof $.fn.slick !== 'undefined') {
  $(document).ready(function(){
    var $slider = $('.as_hero_slick');
    if($slider.length) {
      $slider.slick({
        dots: true,
        arrows: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4500,
        pauseOnHover: true,
        prevArrow: '<button class="as_slick_prev" aria-label="Previous slide"><i class="far fa-chevron-left"></i></button>',
        nextArrow: '<button class="as_slick_next" aria-label="Next slide"><i class="far fa-chevron-right"></i></button>',
        responsive: [{breakpoint:768,settings:{arrows:false,dots:true}}]
      });
    }
  });
}


// ── All Categories dropdown (position:fixed, click-only) ──────────────────
(function(){
  var wrap = document.querySelector('.as_allcats_wrap');
  var btn  = document.querySelector('.as_allcats_btn');
  var drop = document.querySelector('.as_allcats_dropdown');
  if(!wrap || !btn || !drop) return;

  function positionDrop(){
    var r = btn.getBoundingClientRect();
    drop.style.top  = (r.bottom + window.scrollY) + 'px';
    drop.style.left = r.left + 'px';
  }

  function openDrop(){
    positionDrop();
    drop.style.display = 'block';
    btn.setAttribute('aria-expanded','true');
    wrap.classList.add('open');
  }

  function closeDrop(){
    drop.style.display = 'none';
    btn.setAttribute('aria-expanded','false');
    wrap.classList.remove('open');
  }

  function toggleDrop(e){
    e.stopPropagation();
    if(drop.style.display === 'block'){ closeDrop(); } else { openDrop(); }
  }

  btn.addEventListener('click', toggleDrop);

  // Close on outside click
  document.addEventListener('click', function(e){
    if(!wrap.contains(e.target) && !drop.contains(e.target)) closeDrop();
  });

  // Close on Escape
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape') closeDrop();
  });

  // Reposition on scroll/resize
  window.addEventListener('scroll', function(){
    if(drop.style.display==='block') positionDrop();
  }, {passive:true});
  window.addEventListener('resize', function(){
    if(drop.style.display==='block') positionDrop();
  });

  // ── Nav More dropdown ────────────────────────────────────────────────────
  var moreWrap = document.querySelector('.as_nav_more');
  var moreDrop = document.querySelector('.as_nav_more_dropdown');
  if(moreWrap && moreDrop){
    var moreBtn = moreWrap.querySelector('a');
    if(moreBtn){
      // position:fixed for nav_more too
      moreDrop.style.position = 'fixed';
      function positionMore(){
        var r2 = moreBtn.getBoundingClientRect();
        moreDrop.style.top  = (r2.bottom + window.scrollY) + 'px';
        moreDrop.style.left = (r2.right - moreDrop.offsetWidth) + 'px';
      }
      moreBtn.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        if(moreDrop.style.display==='block'){
          moreDrop.style.display='none'; moreWrap.classList.remove('open');
        } else {
          closeDrop();
          positionMore();
          moreDrop.style.display='block'; moreWrap.classList.add('open');
        }
      });
      document.addEventListener('click', function(e){
        if(!moreWrap.contains(e.target)&&!moreDrop.contains(e.target)){
          moreDrop.style.display='none'; moreWrap.classList.remove('open');
        }
      });
      window.addEventListener('scroll', function(){
        if(moreDrop.style.display==='block') positionMore();
      },{passive:true});
    }
  }

})();
