const checkParams = (params) => {
  if (typeof params !== "object") {
    return "params error";
  }
  const maxLength = 256;
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      if (params[key].toString().length > maxLength) {
        return key + " length error";
      }
    }
  }

  const allowedParams = [
    "alignmentTool",
    "task",
    "db",
    "jobTitle",
    "alignTwoOrMoreSequences",
    "query_gencode",
    "query_loc",
    "subject_loc",
    "evalue",
    "word_size",
    "max_target_seqs",
    "culling_limit",
    "gapopen",
    "gapextend",
    "penalty",
    "reward",
    "matrix",
    "comp_based_stats",
    "template_type",
    "template_length",
    "dust",
    "seg",
    "soft_masking",
    "lcase_masking",
  ];
  if (
    Object.getOwnPropertyNames(params).filter(
      (key) => !allowedParams.includes(key)
    ).length > 0
  ) {
    return "params error";
  }

  const dbPattern = /^[a-zA-Z][a-zA-Z0-9_\-]*$/;
  if (params.db && !dbPattern.test(params.db)) {
    return "db error";
  }
  const isNotNumeric = (str) => {
    return str && !/^-?\d+(\.\d+)?$/.test(str);
  };
  if (isNotNumeric(params.evalue)) {
    return "evalue error";
  }
  if (isNotNumeric(params.word_size)) {
    return "word_size error";
  }
  if (isNotNumeric(params.max_target_seqs)) {
    return "max_target_seqs error";
  }
  if (isNotNumeric(params.culling_limit)) {
    return "culling_limit error";
  }
  if (isNotNumeric(params.gapopen)) {
    return "gapopen error";
  }
  if (isNotNumeric(params.gapextend)) {
    return "gapextend error";
  }
  if (isNotNumeric(params.penalty)) {
    return "penalty error";
  }
  if (isNotNumeric(params.reward)) {
    return "reward error";
  }
  if (isNotNumeric(params.template_length)) {
    return "template_length error";
  }
  if (isNotNumeric(params.query_gencode)) {
    return "query_gencode error";
  }
  if (isNotNumeric(params.comp_based_stats)) {
    return "comp_based_stats error";
  }
  const locPattern = /^\d+-\d+$/;
  if (params.query_loc && !locPattern.test(params.query_loc)) {
    return "query_loc error";
  }
  if (params.subject_loc && !locPattern.test(params.subject_loc)) {
    return "subject_loc error";
  }

  const alignmentTool = ["blastn", "blastp", "blastx", "tblastn", "tblastx"];
  const task = [
    "megablast",
    "dc-megablast",
    "blastn",
    "blastp",
    "blastp-short",
    "blastp-fast",
    "blastx",
    "tblastn",
    "tblastx",
  ];
  const matrix = [
    "BLOSUM45",
    "BLOSUM50",
    "BLOSUM62",
    "BLOSUM80",
    "BLOSUM90",
    "PAM30",
    "PAM70",
    "PAM250",
  ];
  const templateType = ["coding", "coding_and_optimal", "optimal"];
  const boolean = [
    "yes",
    "no",
    "true",
    "false",
    "True",
    "False",
    "",
    "TRUE",
    "FALSE",
    "YES",
    "NO",
    true,
    false,
  ];

  if (
    params.alignmentTool &&
    alignmentTool.every((item) => item != params.alignmentTool)
  ) {
    return "alignmentTool error";
  }
  if (params.task && task.every((item) => item != params.task)) {
    return "task error";
  }
  if (params.matrix && matrix.every((item) => item != params.matrix)) {
    return "matrix error";
  }
  if (
    params.templateType &&
    templateType.every((item) => item != params.template_type)
  ) {
    return "template_type error";
  }
  if (params.dust && boolean.every((item) => item != params.dust)) {
    return "dust error";
  }
  if (params.seg && boolean.every((item) => item != params.seg)) {
    return "seg error";
  }
  if (
    params.soft_masking &&
    boolean.every((item) => item != params.soft_masking)
  ) {
    return "soft_masking error";
  }
  if (
    params.lcase_masking &&
    boolean.every((item) => item != params.lcase_masking)
  ) {
    return "lcase_masking error";
  }
  if (
    params.alignTwoOrMoreSequences &&
    boolean.every((item) => item != params.alignTwoOrMoreSequences)
  ) {
    return "alignTwoOrMoreSequences error";
  }

  return "";
};

module.exports = { checkParams };
