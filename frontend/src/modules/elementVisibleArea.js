import $ from 'jquery'

export default function elementVisibleArea(selector, scroll = 'window', offset = 0) {
    let elem_p = $(selector),
        elem_p_height = elem_p.height(),
        offset_top_el = elem_p.offset().top,
        offset_bottom_el = offset_top_el + elem_p.height(),
        scrolled = $(scroll).scrollTop(),
        scrolled_bottom = scrolled + $(scroll).height()

    console.log(scrolled_bottom + offset, offset_top_el, offset_bottom_el, scrolled, $(scroll).height())
    if (scrolled_bottom + offset >= offset_top_el && offset_bottom_el > scrolled) {
        return true;
    }
    return false
}