for hide scrollbar 2 step only

1. add this code in the globall css
   /_ Hide scrollbar but allow scroll _/
   .scrollbar-hide::-webkit-scrollbar {
   display: none;
   }

.scrollbar-hide {
-ms-overflow-style: none; /_ IE/Edge _/
scrollbar-width: none; /_ Firefox _/
}

2. add the className "scrollbar-hide".

   here we go, the scrollbar will be hide
