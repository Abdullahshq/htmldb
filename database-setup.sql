-- Create Contacts table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Contacts]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Contacts](
        [Id] [int] IDENTITY(1,1) PRIMARY KEY,
        [Name] [nvarchar](100) NOT NULL,
        [Email] [nvarchar](100) NOT NULL,
        [Subject] [nvarchar](200) NULL,
        [Message] [nvarchar](max) NOT NULL,
        [SubmissionDate] [datetime] NOT NULL
    )
    
    PRINT 'Contacts table created successfully.'
END
ELSE
BEGIN
    PRINT 'Contacts table already exists.'
END 