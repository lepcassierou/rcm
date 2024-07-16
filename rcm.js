function main() {
    draw_confusion_matrix();
}


function get_rcm_id() {
    return "#rcm";
}


function compute_cell_color(val, m, M, m_opacity, M_opacity) {
    let opacity_val = (Math.abs(val) - m) / (M - m) * (M_opacity - m_opacity) + m_opacity;
    if (val === 0) {
        return ["#FFFFFF", opacity_val];
    }
    return ["#0080FF", opacity_val];
}


function get_label_of_class(nb_classes) {
    if (nb_classes < 0) {
        return 0;
    }
    return nb_classes;
}


function get_matrix_params(matrix) {
    params = {}
    params.nb_classes = matrix.length;
    params.length_per_row = [];
    params.nb_samples = 0;
    params.lines_sum = [];
    for (let i = 0; i < params.nb_classes; ++i) {
        let sum = 0;
        params.length_per_row.push(matrix[i].length);
        for (let j = 0; j < params.nb_classes; ++j) {
            params.nb_samples += matrix[i][j];
            sum += Math.abs(matrix[i][j]);
        }
        params.lines_sum.push(sum);
    }
    return params;
}


function compute_rcm(matrix_A, matrix_B, nb_classes) {
    let rcm = [];
    for (let i = 0; i < nb_classes; ++i) {
        let rcm_row = [];
        for (let j = 0; j < nb_classes; ++j) {
            rcm_row.push(matrix_A[i][j] - matrix_B[i][j]);
        }
        rcm.push(rcm_row);
    }
    return rcm;
}


function min_max_rcm(rcm, nb_classes, nb_samples) {
    let m = nb_samples;
    let M = 0;
    for (let i = 0; i < nb_classes; ++i) {
        for (let j = 0; j < nb_classes; ++j) {
            if (Math.abs(rcm[i][j]) < m)
                m = Math.abs(rcm[i][j]);
            if (Math.abs(rcm[i][j]) > M)
                M = Math.abs(rcm[i][j]);
        }
    }
    return [m, M];
}


function set_svg_size() {
    let rcm_tag = d3.select(get_rcm_id());
    console.log(rcm_tag);
    rcm_tag.attr("width", rcm_width);
    rcm_tag.attr("height", rcm_height);
}


function draw_first_row(rcm_svg, params) {
    let nb_classes = params.nb_classes;
    let margin_x = params.margin_x;
    let margin_y = params.margin_y;
    let cell_w = params.cell_w;
    let cell_h = params.cell_h;
    let color_stroke = params.color_stroke;
    let stroke_w = params.stroke_w;

    for (let i = 0; i <= nb_classes; ++i) {
        rcm_svg.append("rect")
            .attr("x", margin_x + cell_w * i)
            .attr("y", margin_y)
            .attr("width", cell_w)
            .attr("height", cell_h)
            .style("stroke", color_stroke)
            .style("stroke-width", stroke_w)
            .style("fill", "none");

        if (i == 0) {
            rcm_svg.append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("dy", ".35em")
                .attr("font-size", "9")
                .attr("transform", `translate(${cell_w / 3}, ${2 * cell_h / 3}) rotate(45)`)
                .style("text-anchor", "middle")
                .text("GT".substring(0, 3));
            rcm_svg.append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("dy", ".35em")
                .attr("font-size", "8")
                .attr("transform", `translate(${2 * cell_w / 3}, ${cell_h / 3}) rotate(45)`)
                .style("text-anchor", "middle")
                .text("predictions".substring(0, 4));
        } else {
            rcm_svg.append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("dy", ".35em")
                .attr("font-size", "10")
                .attr("transform", `translate(${margin_x + cell_w * (i + .5)}, ${cell_h / 2})`)
                .style("text-anchor", "middle")
                .text(get_label_of_class(i - 1, 5));
        }
    }
}


function draw_first_column(rcm_svg, params) {
    let nb_classes = params.nb_classes;
    let margin_x = params.margin_x;
    let margin_y = params.margin_y;
    let cell_w = params.cell_w;
    let cell_h = params.cell_h;
    let color_stroke = params.color_stroke;
    let stroke_w = params.stroke_w;
    for (let j = 0; j < nb_classes; ++j) {
        rcm_svg.append("rect")
            .style("stroke", color_stroke)
            .style("stroke-width", stroke_w)
            .style("fill", "none")
            .attr("x", margin_x)
            .attr("y", margin_y + cell_h * (j + 1))
            .attr("width", cell_w)
            .attr("height", cell_h);

        rcm_svg.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", ".35em")
            .attr("font-size", "10")
            .attr("transform", `translate(${margin_x + cell_w / 2}, ${margin_y + cell_h * (j + 1.5)})`)
            .style("text-anchor", "middle")
            .text(get_label_of_class(j, 7));

    }
}


function draw_rcm_body(rcm_svg, rcm, params) {
    let nb_classes = params.nb_classes;
    let margin_x = params.margin_x;
    let margin_y = params.margin_y;
    let cell_w = params.cell_w;
    let cell_h = params.cell_h;
    let color_stroke = params.color_stroke;
    let stroke_w = params.stroke_w;
    let lines_sum = params.lines_sum;
    let min_percentage = params.min_percentage;
    let max_percentage = params.max_percentage;
    let color_hovered = params.color_hovered;
    let M = params.M;
    for (let i = 0; i < nb_classes; ++i) {
        for (let j = 0; j < nb_classes; ++j) {
            let cell = rcm_svg.append("rect")
                .style("stroke", color_stroke)
                .style("stroke-width", stroke_w)
                .style("fill", "none");

            cell.attr("x", () => {
                return margin_x + cell_w * (i + 1);
            })
                .attr("y", () => {
                    return margin_y + cell_h * (j + 1);
                })
                .attr("width", cell_w)
                .attr("height", cell_h)
            if (i == j) {
                cell.style("stroke-width", stroke_w + 1);
            }
            if (rcm[j][i] != 0) {
                rcm_svg.append("text")
                    .attr("x", () => {
                        return margin_x + cell_w * (i + 1.5);
                    })
                    .attr("y", () => {
                        return margin_x + cell_h * (j + 1.5); // TODO: margin_y ?
                    })
                    .attr("dy", ".35em")
                    .style("text-anchor", "middle")
                    .text(function () {
                        if (i == j) {
                            if (rcm[j][i] > 0) {
                                return "+";
                            } else {
                                return "-";
                            }
                        } else {
                            if (rcm[j][i] < 0) {
                                return "+";
                            } else {
                                return "-";
                            }
                        }
                    })
                    .attr("pointer-events", "none");
            }

            let cell_color = 0;
            cell_color = compute_cell_color(rcm[j][i], 0, M, 0.1, 1);
            cell.style("fill", cell_color[0])
                .style("fill-opacity", cell_color[1]);

            let percentage = rcm[j][i] * 100 / lines_sum[j];
            max_percentage = Math.max(max_percentage, Math.abs(percentage));
            min_percentage = Math.min(min_percentage, Math.abs(percentage));
            cell.append("title")
                .text(percentage.toFixed(2) + " % (" + (rcm[j][i]) + ")");

            cell.on("mouseover", function () {
                d3.select(this).style("cursor", "pointer");
                rcm_svg.append("rect")
                    .attr("id", "hovered_cell_" + j + "_" + i)
                    .attr("x", () => {
                        return margin_x + cell_w * (i + 1);
                    })
                    .attr("y", () => {
                        return margin_y + cell_h * (j + 1);
                    })
                    .attr("width", cell_w)
                    .attr("height", cell_h)
                    .style("stroke", color_hovered)
                    .style("stroke-width", stroke_w + 1)
                    .style("fill", "none");
            });
            cell.on("mouseout", function () {
                d3.select(this).style("cursor", "default");
                rcm_svg.selectAll("#hovered_cell_" + j + "_" + i).remove();
            });
        }
    }
}


function draw_confusion_matrix() {
    let matrices_exist = check_matrices_existence();
    if (!matrices_exist) {
        return;
    }
    params_A = get_matrix_params(A);
    params_B = get_matrix_params(B);
    check_matrices_compatibility(params_A, params_B);

    rcm = compute_rcm(A, B, params_A.nb_classes);
    let m_M = min_max_rcm(rcm, params_A.nb_classes, params_A.nb_samples);
    let m = m_M[0];
    let M = m_M[1];

    let max_percentage = 0;
    let min_percentage = 1000;

    let margin_x = 1;
    let margin_y = 1;
    set_svg_size();

    let cell_w = (rcm_width - 2 * margin_x) / (params_A.nb_classes + 1);
    let cell_h = (rcm_height - 2 * margin_y) / (params_A.nb_classes + 1);

    let color_stroke = "#7F7F7F";
    let color_hovered = "#3F51B5";
    let stroke_w = 2;
    let rcm_tag_id = get_rcm_id()
    let rcm_svg = d3.select(rcm_tag_id);
    d3.selectAll(rcm_tag_id).selectAll("*").remove();

    rcm_svg.append("line")
        .attr("x1", margin_x)
        .attr("x2", margin_x + cell_w)
        .attr("y1", margin_y)
        .attr("y2", margin_y + cell_h)
        .style("stroke", color_stroke)
        .style("stroke-width", stroke_w)

    let display_params = {};
    display_params.nb_classes = params_A.nb_classes;
    display_params.margin_x = margin_x;
    display_params.margin_y = margin_y;
    display_params.cell_w = cell_w;
    display_params.cell_h = cell_h;
    display_params.color_stroke = color_stroke;
    display_params.color_hovered = color_hovered;
    display_params.stroke_w = stroke_w;
    display_params.max_percentage = max_percentage;
    display_params.min_percentage = min_percentage;
    display_params.M = M;
    display_params.lines_sum = params_A.lines_sum;
    draw_first_row(rcm_svg, display_params);
    draw_first_column(rcm_svg, display_params);
    draw_rcm_body(rcm_svg, rcm, display_params);

    draw_legend(min_percentage, max_percentage);
}