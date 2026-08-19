import{r as s,P as h,e as m}from"./index-CsZmM_z2.js";import{u as P,C as O,a as S}from"./componentbase.esm-B0yTe-yU.js";function a(t){"@babel/helpers - typeof";return a=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a(t)}function k(t,e){if(a(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var r=n.call(t,e);if(a(r)!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function w(t){var e=k(t,"string");return a(e)=="symbol"?e:e+""}function j(t,e,n){return(e=w(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var x={root:function(e){var n=e.props;return m("p-skeleton p-component",{"p-skeleton-circle":n.shape==="circle","p-skeleton-none":n.animation==="none"})}},R=`
@layer primereact {
    .p-skeleton {
        position: relative;
        overflow: hidden;
    }
    
    .p-skeleton::after {
        content: "";
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
    }
    
    .p-skeleton-circle {
        border-radius: 50%;
    }
    
    .p-skeleton-none::after {
        animation: none;
    }
}

@keyframes p-skeleton-animation {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(100%);
    }
}
`,E={root:{position:"relative"}},l=O.extend({defaultProps:{__TYPE:"Skeleton",shape:"rectangle",size:null,width:"100%",height:"1rem",borderRadius:null,animation:"wave",style:null,className:null},css:{classes:x,inlineStyles:E,styles:R}});function u(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable})),n.push.apply(n,r)}return n}function c(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?u(Object(n),!0).forEach(function(r){j(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}var N=s.memo(s.forwardRef(function(t,e){var n=P(),r=s.useContext(h),o=l.getProps(t,r),i=l.setMetaData({props:o}),f=i.ptm,y=i.cx,b=i.sx,d=i.isUnstyled;S(l.css.styles,d,{name:"skeleton"});var p=s.useRef(null);s.useImperativeHandle(e,function(){return{props:o,getElement:function(){return p.current}}});var v=o.size?{width:o.size,height:o.size,borderRadius:o.borderRadius}:{width:o.width,height:o.height,borderRadius:o.borderRadius},g=n({ref:p,className:m(o.className,y("root")),style:c(c({},v),b("root")),"aria-hidden":!0},l.getOtherProps(o),f("root"));return s.createElement("div",g)}));N.displayName="Skeleton";export{N as S};
