import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import { WidgetWithStore } from './WidgetWithStore';
import "./GlobalMenu";
import "./GlobalFooter";

@customElement('user-manual')
export class UserManual extends WidgetWithStore {
    static styles = css`
        :host {
            display: block;
        }

        main {
            margin: 0 auto;
            max-width: 90%;
            padding: 2rem 0;
            position: relative;
        }

        h1 {
            text-align: center;
        }

        :host .red {
            color: var(--color-error);
            font-weight: bold;
        }

        :host .bg-gray {
            background-color: var(--color-grey-c);
        }

        th {
            background: var(--color-grey);
            color: var(--color-white);
            font-weight: normal;
            padding: 5px 10px;
            text-align: left;
        }

        td {
            padding: 5px;
        }

        @media(min-width: 1024px) {
            :host main {
                max-width: 960px;
            }
        }

        @media(min-width: 1024px) {
            :host main {
                padding-left: calc(var(--desktop-menu-slim-width) + 130px);
                max-width: calc(800px + var(--desktop-menu-stacked-width));
                padding-right: 20px;
            }
        }
    `;

    render() {
        return html`
            <global-menu user=${(this.store?.user?.name || "")}></global-menu>
            <main>
                <h1>Parallel Archive v2</h1>
                <h2>History</h2>
                <p>Around 2001, before cloud computing and cloud-based storage became popular, Blinken OSA developed a web application where researchers can upload photos and scans of individual archival document pages, merge them into a document, add metadata to it and keep it either as a private document, or make it publicly available for everyone to see.</p>
                <p>As time went by, mobile phones became a replacement for notebook computers, cloud storage became a common thing, web application technology evolved rapidly, and trust diminished in the authenticity and integrity of archival sources Based on these factors, we had to reimagine Parallel Archive and implement some changes and features.</p>

                <h2>V2 Goals and Accomplishments</h2>
                <p>In face of these developments, and based on feedback collected from the previous version, Parallel Archive v2 was developed focusing on the following goals:</p>
                <ul>
                    <li>Restoring Trust became a key factor, we had to find a technical solution that makes PA “fake data”-resistant. <a href="https://beta.parallelarchive.org/ipfs" target="_blank">IPFS storage</a> was introduced for public documents to avoid compromising data and ascertain the permanent integrity of the uploaded documents.</li>
                    <li>Easier and minimal user interface</li>
                    <li>Operating seamlessly on mobile devices</li>
                    <li>Less required metadata for easier publishing</li>
                </ul>

                <h2>Workflow</h2>
                <p>We envisioned a remarkably simple, yet intuitive workflow for a Parallel Archive user:</p>
                <ul>
                    <li>Take a photo with your phone of your findings in an Archive.</li>
                    <li>If copyright allows, upload the photos to Parallel Archive either directly from your phone, or from your notebook.</li>
                    <li>The application will help in creating a document from the individual pages. Rotate, reorganize, and make a document.</li>
                    <li>Fill in the required metadata.</li>
                    <li>Keep it in your private archive or make it public. By making it public an automatic OCR (Optical Character Recognition) service is extracting the text from your document and saving it for full text searching and further editing.</li>
                    <li>Improve the quality of the OCR by manually correcting the text if necessary.</li>
                    <li>Refer to the document in your publications.</li>
                </ul>

                <h2>Glossary</h2>
                <p>In PA, the following terms are used:</p>
                <ul>
                    <li><b>Image:</b> Any digital image, which is uploaded into the system. (JPEG, PNG, TIFF, HEIC are supported). Usually, a photo of a page or printed photo.</li>
                    <li><b>Document:</b> An organized set of one or multiple images. A document can be private or public.
                        <ul>
                            <li><b>Private document:</b> Documents that are searchable and visible only by the creator. These are stored on the PA server.</li>
                            <li><b>Public documents:</b> Documents that are accessible and visible to everyone. Their metadata can’t be changed from the moment of publication. Public documents are stored on the IPFS file system, so technically they can’t be compromised.</li>
                        </ul>
                    </li>
                    <li><b>Metadata:</b> Useful information about the document entered by its creator.</li>
                    <li><b>OCR:</b> Optical Character Recognition. The service extracts text from your photos, it will happen automatically when you publish a document.</li>
                    <li><b>Collection:</b> A grouping option for each user. Collections are only visible for the user who created them. One user can have an unlimited number of collections. There is only one default collection, which is ‘My Published Documents.’ This can’t be deleted.</li>
                </ul>

                <h2>Metadata</h2>
                <p>In PA, the following terms are used:</p>
                The following metadata can be entered (only three metadata are required for public documents, the rest is optional):</p>
                <ul>
                    <li><span class="red">Original Title:</span> The original title of the document. (Text)</li>
                    <li><b>Original Author:</b> The author(s) of the document. (Text)</li>
                    <li><b>Date Created:</b> The year when the original document was created. (Number)</li>
                    <li><b>Source URL:</b> The URL where the material originating from.</li>
                    <li><b>Period Covered:</b> Which temporal period the document covers. (Number)
                        <ul>
                            <li><b>Year From:</b></li>
                            <li><b>Year To:</b></li>
                        </ul>
                    </li>
                    <li><b>Countries Covered:</b> Which countries are mentioned in the document.</li>
                    <li><b>Tags:</b>Freely assignable tags.</li>
                    <li><b>Archive Category:</b></li>
                    <li><span class="red">Archive Name:</span> The name of the archive where the content originates from. (Text)</li>
                    <li><b>Catalog URL:</b> The URL of the catalog record for the document, if exists. (Text)</li>
                    <li><span class="red">Reference Code:</span> The original archival reference code for the document – form the archive where the document comes from. (Text)</li>
                    <li><b>Publication:</b> The title of the publication the document will be referred to. (Text)</li>
                    <li><b>Languages:</b> The language of the document. (Text)</li>
                    <li><b>Type:</b> Selector if the document is textual or photo. (Text)</li>
                </ul>

                <h2>Metadata Matrix</h2>
                <div>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Private Document</th>
                            <th>Public Document</th>
                            <th>Search</th>
                        </tr>
                        <tr>
                            <td class="bg-gray">Original Title</td>
                            <td>required</td>
                            <td>required</td>
                            <td>yes</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Original Author</td>
                            <td>optional</td>
                            <td>optional</td>
                            <td>yes</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Date Created</td>
                            <td>optional</td>
                            <td>optional</td>
                            <td>no</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Source URL</td>
                            <td>optional</td>
                            <td>optional</td>
                            <td>no</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Period Covered</td>
                            <td>optional</td>
                            <td>optional</td>
                            <td>no / filterable</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Countries Covered</td>
                            <td>optional</td>
                            <td>optional</td>
                            <td>yes / filterable</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Tags</td>
                            <td>optional</td>
                            <td>optional</td>
                            <td>yes / filterable</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Archive Category</td>
                            <td>optional</td>
                            <td>optional</td>
                            <td>no</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Archive Name</td>
                            <td>optional</td>
                            <td>required</td>
                            <td>no</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Catalog URL</td>
                            <td>optional</td>
                            <td>optional</td>
                            <td>no</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Reference Code</td>
                            <td>optional</td>
                            <td>required</td>
                            <td>no</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Publication</td>
                            <td>optional</td>
                            <td>optional</td>
                            <td>no</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Languages</td>
                            <td>optional</td>
                            <td>optional</td>
                            <td>no / filterable</td>
                        </tr>
                        <tr>
                            <td class="bg-gray">Type</td>
                            <td>optional</td>
                            <td>optional</td>
                            <td>no / filterable</td>
                        </tr>
                    </table>
                </div>

                <h2>Menus</h2>
                <p>In each menu you can do the following actions:</p>
                <ul>
                    <li>
                        <p><b>Public Documents:</b></p>
                        <p>Here you can find all the available public documents in the PA system. You can do a full-text search (data that is indexed can be seen in the table above), filter your search results, and sort the result set.</p>
                        <p>By clicking on the select circles on the top right corner of each item, the Add to collection becomes active, and you can add the selected document to one of your existing collections, or you can create a new one.</p>
                        <p>You can visit the detailed information and the document itself by clicking on the document on the result page. This will take you to the document page, where you can see the full set of metadata, you can download the pdf version of the document, you can add comments to it (these will be your own private notes), and read the original machine made and edited OCR versions of the text.</p>
                    </li>
                    <li>
                        <p><b>Uploaded Images:</b></p>
                        <p>All the images you uploaded from your phone or desktop will appear under this menu. By clicking on the selection squares in the top right corner, the New Document button becomes active. This is how you can create a new document from the uploaded images..</p>
                        <p>With the Upload Image button, you can upload images from your computer or your phone. Selecting images and clicking the Delete button will remove the uploaded images from the system.</p>
                    </li>
                    <li>
                        <p><b>Important:</b></p>
                        <p>If you create a document from images, the originally uploaded image stays in your Uploaded Images folder. If you delete an image that was used to create one or more documents, it will not have any effect on the already assembled document.</p>
                        <p>If you click on an image, you have the option to do basic editing on it. You can change its name (it’s useful if you or your phone gave a too general or too complicated name to it) and rotate them. Zooming functions on the top-right corner help you see their content.</p>
                        <p>Once you create a document from images, a new private document will be created. You will see the document editing page. (The same that you can see when clicking on a document in your Private Documents menu).</p>
                    </li>
                    <li>
                        <p><b>Private Documents:</b></p>
                        <p>Under this menu, you can find the list of all the documents that you have created from your uploaded images. By clicking one of them, you will be able to change the order of the pages, edit the metadata of the document, and do an automatic OCR (disclaimer: Once you publish the document, the OCR process will automatically run if you have not initiated it manually while the document was public), publish, or remove your document.</p>
                        <p>With the arrows and the drag and drop button, you can change the order of the pages. After changing the page order, your document is saved automatically.</p>
                        <p>Next to the title on the top, you will see an edit icon. By clicking the metadata editing form will roll down. You can fill out the mandatory metadata here. (To change once mandatory, see the Metadata Matrix above).</p>
                        <p>There are three buttons on the bottom of the page:</p>
                        <p><b>Close:</b> Closes the form and the data entered will not be saved. However, it leaves the values you entered until you are refreshing the browser, or you go to a different document.</p>
                        <p><b>Save:</b> Validates if all the data required for a private document is filled out. If so, it closes and saves the metadata.</p>
                        <p><b>Publish:</b> Validates if all the data required for a public document is filled out. If so, it closes, saves the metadata, and publishes the document. (<b>Important:</b> Once the document becomes public, the only data that you can edit will be the correction of the generated OCR text. Everything else becomes read-only.) Until the document becomes public and spreads on the IPFS network, you will not see it in your ‘My Published Documents’ collection. It takes approx. 30 seconds to appear.</p>
                    </li>
                    <li>
                        <p><b>Private Collections:</b></p>
                        <p>You will see the list of your collections. By clicking the name of the collection, you can see the documents you have added to them. In this menu you can:</p>
                        <ul>
                            <li>Add documents to a collection</li>
                            <li>Remove documents from a collection</li>
                            <li>Create a collection</li>
                            <li>Rename a collection</li>
                        </ul>
                        <p>Collections do not have additional metadata, their goal is to organize content, and group your findings in the Parallel Archive.</p>
                    </li>
                    <li>
                        <p><b>Login / My Account</b></p>
                        <p>If you are not logged in, you can log in or create a new account in the Parallel Archive. In the My Account menu you can change your password.</p>
                    </li>
                </ul>

                <h2>Final Thoughts</h2>
                <p>Parallel Archive is currently in Beta. We are eager to hear your feedback and thoughts on how we can improve our system. We are also welcoming partners who would like to host an IPFS node to make PA more secure and reliable. Do not hesitate to contact us at: <a href="mailto:info@parallelarchive.org">info@parallelarchive.org</p>
                
                <global-footer></global-footer>
            </main>
        `;
    }
}