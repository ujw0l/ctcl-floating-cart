import {useEffect,useRef} from 'react'; 
import {PanelBody,RangeControl, ColorPicker} from  '@wordpress/components';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps,InspectorControls, } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({attributes,setAttributes}) {

	const wholeCont =  useRef('');
	const cartIcon = useRef('');
	const cartContent = useRef('');

	useEffect(()=>{

		

		cartIcon.current.addEventListener('mouseenter',e=> {
			
			cartContent.current.style.left = `-${200 -(cartIcon.current.offsetWidth/2)}px`
			cartContent.current.style.display= '' 
	});
		cartIcon.current.addEventListener('mouseout',e=>cartContent.current.style.display='none');

	});


	return (
		<div { ...useBlockProps() }>

<InspectorControls>
<PanelBody>


<RangeControl
		   

		   label={ __('Cart Icon Size ', 'ctcl-floating-cart')}
		   min= {25}
		   max= {100}
		   onChange = { val => setAttributes({ iconSize: val })}
		   value = {attributes.iconSize}
		   resetFallbackValue= {25}
		   />



<div>

<div style={{marginBottom:'50px',height:'50px'}}>
<p>{__('Select Icon ','ctcl-floating-cart')}</p>
<span style={{width:'50%',float:'left'}}>
<label style={{display:"inline-block", float:"left",width:"50%", fontSize:"40px"}} className={"dashicons dashicons-cart"}> 
	<input style={{display:'inline-block',float:"right",     marginTop: "17px"}}
                        id="cart"
						type="radio"
                        value='product'
                        checked={attributes.iconType === "dashicons-cart"}
                        onChange={val => setAttributes({iconType:'dashicons-cart'})}
                    />
	</label>
</span>

<span style={{width:'50%',float:'right'}}>
	<label style={{display:"inline-block", float:"left",width:"50%", fontSize:"40px"}} className={"dashicons dashicons-products"}> 
	<input style={{display:'inline-block',float:"right",     marginTop: "17px"}}
                        id="products"
						type="radio"
                        value='products'
                        checked={attributes.iconType === "dashicons-products"}
                        onChange={val => setAttributes({iconType:'dashicons-products'})}
                    />
	</label>

</span>

</div>

<div>
<p>{__('Font Color','ctcl-floating-cart')}  </p>
<ColorPicker 

color={attributes.fontColor}
onChange={val=> setAttributes({fontColor:val})}
/>

</div>

<div>
<p>{__('Background Color','ctcl-floating-cart')}  </p>
<ColorPicker 

color={attributes.bgColor}
onChange={val=> setAttributes({bgColor:val})}
/>
</div>
</div>

</PanelBody>



</InspectorControls>
     <div ref={wholeCont} style={{display:'inline-block'}}>
	 <div><div  ref={cartIcon} className= {`ctcl-floating-cart-icon dashicons ${attributes.iconType}`} style={{color:`${attributes.fontColor}`, fontSize:`${attributes.iconSize}px`, backgroundColor:`${attributes.bgColor}`,marginLeft:"auto", marginRight:'auto',  height:'auto',width:'auto',padding:'5px',cursor:'pointer',  }}>
	 <div style={{ borderRadius : '100%', position: 'absolute',display:'inline-block', width:'auto', height:'auto', padding:`${attributes.iconSize/8}px`,paddingTop:`${attributes.iconSize/20}px`, border:`0.5px solid ${attributes.fontColor}`, marginTop:`-10px`,backgroundColor:attributes.bgColor, color:attributes.fontColor,fontSize:`${attributes.iconSize/5}px`}}> 0 </div>
		</div> 
	 
	 
	  </div>

<div ref={cartContent} className='ctcl-floating-cart-content' style={{border:`1px solid ${attributes.fontColor}`,borderRadius:'5px', boxShadow:`5px 10px 8px #888888` , position:'absolute',marginTop:"5px",display:'none', zIndex:'1000000', color:`${attributes.fontColor}`,backgroundColor:`${attributes.bgColor}`, width:'400px', textAlign:'center' }}> <p className={`dashicons-before ${attributes.iconType} ctcl-floating-cart-content`}> {__('Contains cart items','ctcl-floating-cart')} </p> </div>
		</div>

</div>
	);
}
