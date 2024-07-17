var nb_problems = 0;


function get_problems_id() {
    return "#problems";
}


function clear_problems() {
    let id = get_problems_id();
    d3.selectAll(id).selectAll("*").remove();
}


function initialize_problems_list() {
    let id = get_problems_id();
    let problems_tag = d3.select(id);
    problems_tag.style("border", "solid black 2px");
    problems_tag.style("padding", "10px");
    problems_tag.style("font-family", global_font_family);
    problems_tag.append("p").text("Problems: ");
    problems_tag.append("ul");
}


function add_problem(pbm){
    let id = get_problems_id();
    d3.select(id).select("ul")
        .append("li")
        .text(pbm);
}


function print_problem(pbm) {
    if (!pbm)
        return;
    console.log(pbm);
    if (nb_problems == 0)
        initialize_problems_list();
    add_problem(pbm);
    ++nb_problems;
}