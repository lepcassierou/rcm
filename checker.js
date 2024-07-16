function check_matrices_existence() {
    a = typeof A !== 'undefined';
    b = typeof B !== 'undefined';
    if (!a) {
        print_problem("Matrix A is undefined");
    }
    if (!b) {
        print_problem("Matrix B is undefined");
    }
    if (a && b)
        return true;
    else
        return false;
}


function check_square_matrix(params) {
    for (let i = 0; i < params.nb_classes; ++i) {
        if (params.length_per_row[i] != params.nb_classes) {
            return false;
        }
    }
    return true;
}


function check_samples_number(params_A, params_B){
    let sum_A = params_A.lines_sum;
    let sum_B = params_B.lines_sum;
    for (let i = 0; i < sum_A.length; ++i) {
        if(sum_A[i] != sum_B[i]){
            return [i, sum_A[i], sum_B[i]];
        }
    }
    return [-1, 0, 0];
}


function check_matrices_compatibility(params_A, params_B) {
    clear_problems();

    let is_A_squared = check_square_matrix(params_A);
    if (!is_A_squared) {
        print_problem("Matrix A is not squared");
    }
    let is_B_squared = check_square_matrix(params_B);
    if (!is_B_squared) {
        print_problem("Matrix B is not squared");
    }

    let response_samples = check_samples_number(params_A, params_B);
    if (response_samples[0] != -1) {
        let index = response_samples[0];
        let sum_a = response_samples[1];
        let sum_b = response_samples[2];
        print_problem("Matrices A and B should have the same number of samples per row, but sum(A[" + index + "]) = " + sum_a + " and sum(B[" + index + "]) = " + sum_b);
    }

    if (params_A.nb_classes != params_B.nb_classes) {
        print_problem("Matrices A and B should have the same number of classes, but have " + params_A.nb_classes + " and " + params_B.nb_classes + ". ");
    }
}