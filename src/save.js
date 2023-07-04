/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save({attributes}) {
	return (
		<div { ...useBlockProps.save() } style={{display:'inline-block'}}>
				<div  className= {`ctcl-floating-cart-icon dashicons ${attributes.iconType}`} style={{ display:'inline-block', color:`${attributes.fontColor}`, fontSize:`${attributes.iconSize}px`, backgroundColor:`${attributes.bgColor}`,marginLeft:"auto", marginRight:'auto',  height:'auto',width:'auto',padding:'5px',cursor:'pointer'  }}>
					
				<div className='ctcl-floating-cart-item-count' style={{ borderRadius : '100%', position: 'absolute',display:'inline-block', width:'auto', height:'auto', padding:`${attributes.iconSize/8}px`,paddingTop:`${attributes.iconSize/20}px`, border:`0.5px solid ${attributes.fontColor}`, marginTop:`-10px`,backgroundColor:attributes.bgColor, color:attributes.fontColor,fontSize:`${attributes.iconSize/5}px`}}> 0 </div>

			   </div> 
				<div className= {`ctcl-floating-cart-content`} style={{ border:`1px solid ${attributes.fontColor}`,borderRadius:'5px', boxShadow:`5px 10px 8px #888888` ,position : 'absolute', marginTop:'5px',display:'none', zIndex:'10000000', color:`${attributes.fontColor}`,backgroundColor:`${attributes.bgColor}`, width:'400px', textAlign:'center' }}> <p className={`dashicons-before  ${attributes.iconType} ctcl-floating-empty-cart-content`} > {__('No items in cart','ctcl-floating-cart')} </p> </div>

		</div>
	);
}
