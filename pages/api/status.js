function status(request, response) {
  response.status(200).json({"Status": "Up"});
}

export default status;
