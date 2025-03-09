import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

export default async ({ req, res, log, error }) => {
  try {

    const data = req.body
    log(data,data.accessKey); // Debugging: Check the request body structure
    

    const { accessKey, secretKey, bucketName } = req.body; // No need for JSON.parse
    log(accessKey,secretKey,bucketName)

    if (!accessKey || !secretKey || !bucketName) {
      return res.json({ success: false, message: "Missing credentials" });
    }

    // Initialize S3 client
    const s3Client = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    // List buckets
    const response = await s3Client.send(new ListBucketsCommand({}));

    const bucketExists = response.Buckets?.some(
      (bucket) => bucket.Name === bucketName
    );

    if (!bucketExists) {
      return res.json({ success: false, message: "Bucket not found" });
    }

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
    error(err.message);
    return res.json({ success: false, message: err.message });
  }
};
