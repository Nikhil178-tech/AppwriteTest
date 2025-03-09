import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

export default async ({ req, res, log, error }) => {
  try {
    // Debugging: Log the raw request body to inspect its structure
    log("Raw Request Body:", req.body);

    // Parse the request body as JSON
    const body = JSON.parse(req.body);
    log("Parsed Request Body:", body);

    // Destructure the required fields from the parsed body
    const { accessKey, secretKey, bucketName } = body;
    log("Access Key:", accessKey);
    log("Secret Key:", secretKey);
    log("Bucket Name:", bucketName);

    // Validate input
    if (!accessKey || !secretKey || !bucketName) {
      return res.json({ success: false, message: "Missing credentials" });
    }

    // Initialize S3 client
    const s3Client = new S3Client({
      region: "us-east-1", // Replace with your AWS region
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    // List buckets
    const response = await s3Client.send(new ListBucketsCommand({}));

    // Check if the bucket exists
    const bucketExists = response.Buckets?.some(
      (bucket) => bucket.Name === bucketName
    );

    if (!bucketExists) {
      return res.json({ success: false, message: "Bucket not found" });
    }

    // Return success response
    return res.json({
      success: true,
      steps: [
        { id: 1, label: "Validating credentials", completed: true },
        { id: 2, label: "Establishing connection", completed: true },
        { id: 3, label: "Testing permissions", completed: true },
        { id: 4, label: "Finalizing setup", completed: true },
      ],
      response,
    });
  } catch (err) {
    // Log the error and return a failure response
    error("Error:", err.message);
    return res.json({ success: false, message: err.message });
  }
};